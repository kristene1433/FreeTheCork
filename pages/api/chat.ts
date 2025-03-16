import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { OpenAI } from "openai";
import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

interface WinePreferences {
  drynessLevel?: string;
  favoriteTypes?: string[];
  dislikedFlavors?: string[];
  budgetRange?: string;
  knowledgeLevel?: string;
  locationZip?: string;
}

interface UserDoc {
  _id: string;
  email: string;
  membership?: string;
  winePreferences?: WinePreferences;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const session = await getServerSession(req, res, authOptions);
  const sessionEmail = session?.user?.email || "";

  let preferenceString = "";
  try {
    if (sessionEmail) {
      await dbConnect();
      const doc = await User.findOne({ email: sessionEmail }).lean<UserDoc>();

      if (doc?.membership === "premium" && doc?.winePreferences) {
        const {
          drynessLevel,
          favoriteTypes,
          dislikedFlavors,
          budgetRange,
          knowledgeLevel,
          locationZip,
        } = doc.winePreferences;

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
  } catch (err) {
    console.error("Preference load error:", err);
  }

  if (needsWebSearch(prompt)) {
    // Perform web search logic
    try {
      const answer = await performWebSearch(prompt, preferenceString);
      return res.status(200).json({ answer });
    } catch (err) {
      console.error("Web Search Error:", err);
      return res.status(500).json({ error: "Failed to perform web search." });
    }
  } else {
    // Direct AI response
    try {
      const directAnswer = await directAiResponse(prompt, preferenceString);
      return res.status(200).json({ answer: directAnswer });
    } catch (err) {
      console.error("AI Error:", err);
      return res.status(500).json({ error: "Failed to get direct AI answer." });
    }
  }
}

// Determine if web search is needed
function needsWebSearch(prompt: string): boolean {
  const keywords = [
    "available", "price", "latest", "buy", "vintage", "store", "find",
    "purchase", "Wine Spectator", "ratings", "Wine Enthusiast", "Decanter"
  ];
  return keywords.some(k => prompt.toLowerCase().includes(k));
}

// Direct AI response logic
async function directAiResponse(userPrompt: string, preferences: string): Promise<string> {
  console.log("🤖 Using direct AI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
You are Kristene, a charming and witty AI Sommelier specializing exclusively in wine. 
- Politely decline or redirect if the user asks about anything that is not clearly related to wine (e.g., weather, sports, general trivia).
- Keep the conversation going by asking additional wine-related questions or offering further wine guidance.
- Always respond professionally and warmly.
${preferences}
        `
      },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0].message?.content ?? "No response";
}

// Perform web search logic
async function performWebSearch(query: string, preferences: string): Promise<string> {
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

Return results clearly formatted in markdown with store names, brief descriptions, prices, availability, and links. Clearly separate each result with a triple dash (---). Provide no raw HTML.
`,
        instructions: "Output must be markdown or plain text without raw HTML."
      })
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

    const message = data.output.find((item: WebSearchOutputItem) => item.type === "message");
    const messageContent = message?.content ?? [];

    const rawText = messageContent
      .filter((item: WebSearchOutputItem) => item.type === "output_text")
      .map((item: WebSearchOutputItem) => item.text || "")
      .join("\n\n");

    return rawText || "No web results found.";
  } catch (error) {
    console.error("❌ Web Search Error:", error);
    return "I couldn't retrieve store listings. Try searching on Wine.com or Total Wine.";
  }
}
