// pages/api/sommelier.ts

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

// Usage shape for basic (free) plan
interface UsageInfo {
  count: number;
  lastUsed: string; // date string 'YYYY-MM-DD'
}

interface UserDoc {
  _id: string;
  email: string;
  membership?: string; // "basic" or "premium"
  winePreferences?: WinePreferences;
  usage?: UsageInfo;
}

// ──────────────────────────────────────────────────────────────────────────────
// 1) Create a single top-level instance of OpenAI
// ──────────────────────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ──────────────────────────────────────────────────────────────────────────────
// Main Handler
// ──────────────────────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Retrieve user session
  const session = await getServerSession(req, res, authOptions);
  const sessionEmail = session?.user?.email || "";

  // Initialize membership and preference string
  let userMembership = "basic";
  let preferenceString = "";
  let userDoc: UserDoc | null = null;

  // ────────────────────────────────────────────────────────────────────────────
  // 2) Load user doc and preferences
  // ────────────────────────────────────────────────────────────────────────────
  try {
    if (sessionEmail) {
      await dbConnect();
      userDoc = await User.findOne({ email: sessionEmail }).lean<UserDoc>();

      // If userDoc found and membership is 'premium'
      if (userDoc?.membership === "premium") {
        userMembership = "premium";
        if (userDoc?.winePreferences) {
          const {
            drynessLevel,
            favoriteTypes,
            dislikedFlavors,
            budgetRange,
            knowledgeLevel,
            locationZip,
          } = userDoc.winePreferences;

          preferenceString = `
User Preferences:
- Dryness Level: ${drynessLevel || "N/A"}
- Favorite Types: ${favoriteTypes?.join(", ") || "N/A"}
- Disliked Flavors: ${dislikedFlavors?.join(", ") || "N/A"}
- Budget Range: ${budgetRange || "N/A"}
- Knowledge Level: ${knowledgeLevel || "N/A"}
- Location Zip: ${locationZip || "N/A"}

Use these preferences if and only if the user is seeking personalized wine recommendations. 
If the user's request explicitly asks about a specific wine or topic unrelated to their preferences, ignore these preferences and directly answer the user's specific request.
`;
        }
      }
    }
  } catch (err) {
    console.error("Preference load error:", err);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3) If user is 'basic', enforce daily 5-query limit + skip web search
  // ────────────────────────────────────────────────────────────────────────────
  if (userMembership === "basic") {
    const freeCheck = await enforceFreeLimit(userDoc);
    if (!freeCheck.success) {
      // If usage limit exceeded, respond accordingly
      return res.status(403).json({ error: freeCheck.message });
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 4) If 'premium' and the user query triggers web search => use web search
  //    If 'basic', skip web search
  // ────────────────────────────────────────────────────────────────────────────
  if (userMembership === "premium" && needsWebSearch(prompt)) {
    try {
      const answer = await performWebSearch(prompt, preferenceString);
      return res.status(200).json({ answer });
    } catch (err) {
      console.error("Web Search Error:", err);
      return res.status(500).json({ error: "Failed to perform web search." });
    }
  } else {
    // Otherwise, direct AI response for both basic & premium
    try {
      const directAnswer = await directAiResponse(prompt, preferenceString);
      return res.status(200).json({ answer: directAnswer });
    } catch (err) {
      console.error("AI Error:", err);
      return res.status(500).json({ error: "Failed to get direct AI answer." });
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Enforce daily limit for 'basic' membership: 5 queries per day
// ──────────────────────────────────────────────────────────────────────────────
async function enforceFreeLimit(
  userDoc: UserDoc | null
): Promise<{ success: boolean; message?: string }> {
  // If no user doc or usage, let them proceed. You could also block, if needed.
  if (!userDoc) {
    return { success: true };
  }

  const today = new Date().toISOString().slice(0, 10); // e.g. "2025-03-16"
  const usage: UsageInfo = userDoc.usage || { count: 0, lastUsed: "" };

  // If user's last usage day is not today, reset
  if (usage.lastUsed !== today) {
    usage.count = 0;
    usage.lastUsed = today;
  }

  // If usage already at 5, block
  if (usage.count >= 5) {
    return {
      success: false,
      message:
        "You have reached your daily free limit of 5 inquiries. Please upgrade to premium for unlimited queries.",
    };
  }

  // Otherwise increment usage
  usage.count += 1;

  // Save usage changes to DB
  try {
    await User.updateOne({ _id: userDoc._id }, { $set: { usage } });
  } catch (updateErr) {
    console.error("Error updating user usage:", updateErr);
    // If updating fails, you decide how to handle it. For now, we allow proceed.
  }

  return { success: true };
}

// ──────────────────────────────────────────────────────────────────────────────
// Determine if web search is needed
// ──────────────────────────────────────────────────────────────────────────────
function needsWebSearch(prompt: string): boolean {
  const keywords = [
    "available",
    "price",
    "latest",
    "buy",
    "vintage",
    "store",
    "find",
    "purchase",
    "Wine Spectator",
    "ratings",
    "Wine Enthusiast",
    "Decanter",
  ];
  return keywords.some((k) => prompt.toLowerCase().includes(k));
}

// ──────────────────────────────────────────────────────────────────────────────
// Direct AI response logic (using the single top-level openai instance)
// ──────────────────────────────────────────────────────────────────────────────
async function directAiResponse(
  userPrompt: string,
  preferences: string
): Promise<string> {
  console.log("🤖 Using direct AI...");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
You are Kristene, a charming and witty AI Sommelier specializing exclusively in wine. 
- Politely decline or redirect if the user asks about anything not clearly related to wine.
- Keep the conversation going by asking additional wine-related questions or offering further wine guidance.
- Always respond professionally and warmly.
${preferences}
        `,
      },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "No response";
}

// ──────────────────────────────────────────────────────────────────────────────
// Perform web search logic (also uses the single top-level openai instance)
// ──────────────────────────────────────────────────────────────────────────────
async function performWebSearch(
  query: string,
  preferences: string
): Promise<string> {
  console.log("🔍 Using Web Search...");

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
        input: `
For the query: "${query}".
${preferences}

Return results clearly formatted in markdown with store names, brief descriptions, prices, availability, and links. 
Separate each result with a triple dash (---). 
Provide no raw HTML.
`,
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
