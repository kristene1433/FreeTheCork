// /pages/api/account/preferences.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function preferencesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Validate session
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // 2) Connect to DB
  await dbConnect();

  // 3) Find user doc
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // 4) Handle GET to return current preferences
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ preferences: user.winePreferences || {} });
  }

  // 5) Handle POST to save new preferences
  if (req.method === "POST") {
    // Only premium membership can save
    if (user.membership !== "premium") {
      return res
        .status(403)
        .json({ error: "Only premium can save preferences" });
    }

    // Destructure from request body
    const {
      drynessLevel,
      favoriteTypes,
      dislikedFlavors,
      budgetRange,
      knowledgeLevel,
      locationZip,
    } = req.body;

    // 6) Update user doc with new fields
    user.winePreferences = {
      drynessLevel,
      favoriteTypes,
      dislikedFlavors,
      budgetRange,
      knowledgeLevel,
      locationZip, // Also store the ZIP code
    };

    await user.save();

    return res.status(200).json({
      message: "Preferences saved!",
      preferences: user.winePreferences,
    });
  }

  // 6) Otherwise, method not allowed
  return res.status(405).json({ error: "Method Not Allowed" });
}
