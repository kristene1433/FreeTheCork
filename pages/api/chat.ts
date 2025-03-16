import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { OpenAI } from "openai";
import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

// Wine preferences shape
interface WinePreferences {
  drynessLevel?: string;
  favoriteTypes?: string[];
  dislikedFlavors?: string[];
  budgetRange?: string;
  knowledgeLevel?: string;
  locationZip?: string;
}

// For basic (free) plan usage limit
interface UsageInfo {
  count: number;
  lastUsed: string; // date string 'YYYY-MM-DD'
}

// Conversation message structure
interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UserDoc {
  _id: string;
  email: string;
  membership?: string; // "basic" or "premium"
  passwordHash: string;
  winePreferences?: WinePreferences;
  usage?: UsageInfo;
  conversationHistory?: ConversationMessage[];
}

// Single top-level OpenAI instance
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Main Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Retrieve session
  const session = await getServerSession(req, res, authOptions);
  const sessionEmail = session?.user?.email || "";

  let userDoc: UserDoc | null = null;
  let userMembership = "basic";
  let preferenceString = "";

  try {
    if (sessionEmail) {
      await dbConnect();
      userDoc = await User.findOne({ email: sessionEmail });

      // Check membership
      if (userDoc?.membership === "premium") {
        userMembership = "premium";
      }

      // Build preferences if premium
      if (userMembership === "premium" && userDoc?.winePreferences) {
        const {
          drynessLevel,
          favoriteTypes,
          dislikedFlavors,
          budgetRange,
          knowledgeLevel,
          locationZip,
        } = userDoc.winePreferences;

        preferenceString = `\nUser Preferences:\n- Dryness Level: ${drynessLevel || "N/A"}\n- Favorite Types: ${favoriteTypes?.join(", ") || "N/A"}\n- Disliked Flavors: ${dislikedFlavors?.join(", ") || "N/A"}\n- Budget Range: ${budgetRange || "N/A"}\n- Knowledge Level: ${knowledgeLevel || "N/A"}\n- Location Zip: ${locationZip || "N/A"}\n\nUse these preferences if and only if the user is seeking personalized wine recommendations.\nIf the user's request explicitly asks about a specific wine or topic unrelated to their preferences, ignore these preferences and directly answer the user's specific request.\n`;
      }
    }
  } catch (err) {
    console.error("Preference load error:", err);
  }

  // If basic user, enforce daily limit
  if (userMembership === "basic") {
    const freeCheck = await enforceFreeLimit(userDoc);
    if (!freeCheck.success) {
      return res.status(403).json({ error: freeCheck.message });
    }
  }

  // 1) Update conversation memory with the new user message
  // We'll store up to 6 messages total to keep it short.
  const conversationMessages: ConversationMessage[] = await updateConversationHistory(
    userDoc,
    sessionEmail,
    { role: "user", content: prompt }
  );

  // 2) Decide if we need web search (only if premium)
  if (userMembership === "premium" && needsWebSearch(prompt)) {
    try {
      const answer = await performWebSearch(conversationMessages, preferenceString);
      // Then store that answer in conversation history as well
      await updateConversationHistory(userDoc, sessionEmail, {
        role: "assistant",
        content: answer,
      });

      return res.status(200).json({ answer });
    } catch (err) {
      console.error("Web Search Error:", err);
      return res.status(500).json({ error: "Failed to perform web search." });
    }
  } else {
    // 3) Direct AI response
    try {
      const directAnswer = await directAiResponse(conversationMessages, preferenceString);

      // Save the assistant response to conversation
      await updateConversationHistory(userDoc, sessionEmail, {
        role: "assistant",
        content: directAnswer,
      });

      return res.status(200).json({ answer: directAnswer });
    } catch (err) {
      console.error("AI Error:", err);
      return res.status(500).json({ error: "Failed to get direct AI answer." });
    }
  }
}

// Enforce daily limit for 'basic' membership: 5 queries per day
async function enforceFreeLimit(
  userDoc: UserDoc | null
): Promise<{ success: boolean; message?: string }> {
  // If no userDoc or usage, let them proceed
  if (!userDoc) {
    return { success: true };
  }

  const today = new Date().toISOString().slice(0, 10); // e.g. "2025-03-16"
  const usage: UsageInfo = userDoc.usage || { count: 0, lastUsed: "" };

  // Reset if new day
  if (usage.lastUsed !== today) {
    usage.count = 0;
    usage.lastUsed = today;
  }

  if (usage.count >= 5) {
    return {
      success: false,
      message: "You have reached your daily free limit of 5 inquiries. Please upgrade to premium for unlimited queries.",
    };
  }

  // Otherwise increment usage
  usage.count += 1;

  try {
    await User.updateOne({ _id: userDoc._id }, { $set: { usage } });
  } catch (err) {
    console.error("Error updating usage:", err);
  }

  return { success: true };
}

// Decide if web search is needed
function needsWebSearch(prompt: string): boolean {
  const keywords = [
    "available", "price", "latest", "buy", "vintage", "store", "find",
    "purchase", "Wine Spectator", "ratings", "Wine Enthusiast", "Decanter"
  ];
  return keywords.some((k) => prompt.toLowerCase().includes(k));
}

/**
 * Update conversation history in the DB.
 * We'll limit to 6 messages total to keep context short.
 * We'll always preserve the initial system instruction if present.
 */
async function updateConversationHistory(
  userDoc: UserDoc | null,
  sessionEmail: string,
  newMessage: ConversationMessage
): Promise<ConversationMessage[]> {
  // Build the initial system message that sets the tone.
  // Note: We'll store it at index 0 if it doesn't exist.
  const systemMessage: ConversationMessage = {
    role: "system",
    content: `You are Kristene, a witty, knowledgeable AI Sommelier.\n- Keep track of previous user context (e.g. goat cheese, Sauvignon Blanc).\n- Provide direct, concise answers first, but can go deeper if user shows advanced interest.\n- Focus on wine. Politely redirect off-topic requests.\n- Keep a friendly, professional tone.\n`,
  };

  if (!userDoc) {
    // If user not found in DB, just build ephemeral conversation.
    const ephemeralHistory = [systemMessage, newMessage];
    return ephemeralHistory;
  }

  // We have a userDoc, let's get their conversationHistory
  userDoc.conversationHistory = userDoc.conversationHistory || [];

  // If the conversation is empty, add the system message.
  if (userDoc.conversationHistory.length === 0) {
    userDoc.conversationHistory.push(systemMessage);
  }

  // Push the new message
  userDoc.conversationHistory.push(newMessage);

  // Limit to last 6 messages, but keep the system message at index 0.
  // So we do something like: keep system message, plus last 5 messages.
  if (userDoc.conversationHistory.length > 6) {
    // remove messages from index 1 up to length-6
    const toRemove = userDoc.conversationHistory.length - 6;
    userDoc.conversationHistory.splice(1, toRemove);
  }

  // Save to DB
  try {
    await User.updateOne(
      { _id: userDoc._id },
      { $set: { conversationHistory: userDoc.conversationHistory } }
    );
  } catch (err) {
    console.error("Error updating conversationHistory:", err);
  }

  return userDoc.conversationHistory;
}

// Direct AI response logic
async function directAiResponse(
  conversationMessages: ConversationMessage[],
  preferences: string
): Promise<string> {
  console.log("🤖 Using direct AI...");

  // Combine the existing conversation with the user preferences.
  // We'll insert an extra system message containing preferences.

  const messagesForOpenAI = [...conversationMessages];

  // Insert a short system message about the user preferences right after the first system message.
  // This ensures we preserve the original system message's instructions but also incorporate user prefs.

  if (preferences.trim()) {
    messagesForOpenAI.splice(1, 0, {
      role: "system",
      content: preferences,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messagesForOpenAI.map((m) => ({ role: m.role, content: m.content })),
  });

  return response.choices[0]?.message?.content ?? "No response";
}

// Perform web search logic
async function performWebSearch(
  conversationMessages: ConversationMessage[],
  preferences: string
): Promise<string> {
  console.log("🔍 Using Web Search...");

  // We combine conversation context similarly with the user preferences.
  const messagesForOpenAI = [...conversationMessages];

  if (preferences.trim()) {
    messagesForOpenAI.splice(1, 0, {
      role: "system",
      content: preferences,
    });
  }

  // We'll supply the user's last question as "query".
  // The last message from the user should be at the end of messagesForOpenAI.
  const userMessage = messagesForOpenAI.reverse().find((m) => m.role === "user");
  const query = userMessage?.content || "";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        tool_choice: { type: "web_search_preview" },
        input: `\nFor the query: "${query}".\n${preferences}\n\nReturn results clearly formatted in markdown with store names, brief descriptions, prices, availability, and links.\nSeparate each result with a triple dash (---).\nProvide no raw HTML.\n`,
        instructions: "Output must be markdown or plain text without raw HTML.",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Web Search API Error: ${response.statusText} - ${errorText}`);
    }

    interface WebSearchOutputItem {
      type: string;
      text?: string;
      content?: WebSearchOutputItem[];
    }

    const data: { output: WebSearchOutputItem[] } = await response.json();
    const message = data.output.find((item) => item.type === "message");
    const messageContent = message?.content ?? [];

    const rawText = messageContent
      .filter((item) => item.type === "output_text")
      .map((item) => item.text || "")
      .join("\n\n");

    return rawText || "No web results found.";
  } catch (error) {
    console.error("❌ Web Search Error:", error);
    return "I couldn't retrieve store listings. Try searching on Wine.com or Total Wine.";
  }
}
