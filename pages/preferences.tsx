// /pages/preferences.tsx

"use client";

import { useSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // <--- useRouter for redirect

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // <--- for router.push

  // Form fields
  const [drynessLevel, setDrynessLevel] = useState("");
  const [favoriteTypes, setFavoriteTypes] = useState<string[]>([]);
  const [dislikedFlavors, setDislikedFlavors] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState("");
  const [locationZip, setLocationZip] = useState("");

  const [message, setMessage] = useState("");

  // Example options
  const drynessOptions = ["Sweet", "Semi-sweet", "Dry"];
  const knowledgeOptions = ["Beginner", "Intermediate", "Advanced"];
  const favoriteTypeOptions = ["White", "Sparkling", "Dessert", "Red", "Rosé"];
  const dislikedFlavorOptions = ["Smoky", "Oaky", "Earthy"];

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    } else if (status === "authenticated") {
      loadPreferences();
    }
  }, [status]);

  // 1) Load existing preferences
  async function loadPreferences() {
    try {
      const res = await fetch("/api/account/preferences");
      if (res.ok) {
        const data = await res.json();
        const prefs = data.preferences || {};
        setDrynessLevel(prefs.drynessLevel || "");
        setFavoriteTypes(prefs.favoriteTypes || []);
        setDislikedFlavors(prefs.dislikedFlavors || []);
        setBudgetRange(prefs.budgetRange || "");
        setKnowledgeLevel(prefs.knowledgeLevel || "");
        setLocationZip(prefs.locationZip || "");
      } else {
        const errorData = await res.json();
        console.error("Load preferences error:", errorData);
      }
    } catch (err) {
      console.error("loadPreferences error:", err);
    }
  }

  // 2) Save Preferences => POST /api/account/preferences
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/account/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drynessLevel,
          favoriteTypes,
          dislikedFlavors,
          budgetRange,
          knowledgeLevel,
          locationZip,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || "Preferences saved successfully!");
        // Redirect to dashboard after a brief delay or immediately
        // so user sees success message then navigates
        router.push("/dashboard"); // <--- redirect
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Error saving preferences.");
      }
    } catch (err) {
      console.error("savePreferences error:", err);
      setMessage("Error saving preferences.");
    }
  }

  // 3) Toggle checkboxes for favorites
  function toggleFavoriteType(type: string) {
    if (favoriteTypes.includes(type)) {
      setFavoriteTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setFavoriteTypes((prev) => [...prev, type]);
    }
  }

  // 4) Toggle checkboxes for disliked flavors
  function toggleDislikedFlavor(flavor: string) {
    if (dislikedFlavors.includes(flavor)) {
      setDislikedFlavors((prev) => prev.filter((f) => f !== flavor));
    } else {
      setDislikedFlavors((prev) => [...prev, flavor]);
    }
  }

  // While session loads, show loader
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading session...</div>;
  }

  // If no session, user is not logged in
  if (!session) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  // 5) The Form UI
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Your Wine Preferences</h1>

        {message && <p className="mb-4 text-green-600">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Dryness (Dropdown) */}
          <label className="block mb-1 font-semibold">Dryness Level:</label>
          <select
            className="border p-2 w-full mb-4"
            value={drynessLevel}
            onChange={(e) => setDrynessLevel(e.target.value)}
          >
            <option value="">-- Select dryness level --</option>
            {drynessOptions.map((opt) => (
              <option key={opt} value={opt.toLowerCase()}>
                {opt}
              </option>
            ))}
          </select>

          {/* Favorite Types (Checkboxes) */}
          <label className="block mb-1 font-semibold">Favorite Types:</label>
          <div className="mb-4">
            {favoriteTypeOptions.map((opt) => {
              const val = opt.toLowerCase();
              const checked = favoriteTypes.includes(val);
              return (
                <label key={opt} className="mr-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFavoriteType(val)}
                  />
                  <span className="ml-1">{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Disliked Flavors (Checkboxes) */}
          <label className="block mb-1 font-semibold">Disliked Flavors:</label>
          <div className="mb-4">
            {dislikedFlavorOptions.map((opt) => {
              const val = opt.toLowerCase();
              const checked = dislikedFlavors.includes(val);
              return (
                <label key={opt} className="mr-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDislikedFlavor(val)}
                  />
                  <span className="ml-1">{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Budget Range (Text) */}
          <label className="block mb-1 font-semibold">Budget Range:</label>
          <input
            className="border p-2 w-full mb-4"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            placeholder='e.g. \"${10-20}\"'
          />

          {/* Knowledge Level (Dropdown) */}
          <label className="block mb-1 font-semibold">Knowledge Level:</label>
          <select
            className="border p-2 w-full mb-4"
            value={knowledgeLevel}
            onChange={(e) => setKnowledgeLevel(e.target.value)}
          >
            <option value="">-- Select knowledge level --</option>
            {knowledgeOptions.map((opt) => (
              <option key={opt} value={opt.toLowerCase()}>
                {opt}
              </option>
            ))}
          </select>

          {/* Location ZIP Code (Text) */}
          <label className="block mb-1 font-semibold">Location ZIP Code:</label>
          <input
            className="border p-2 w-full mb-4"
            value={locationZip}
            onChange={(e) => setLocationZip(e.target.value)}
            placeholder='e.g. \"90210\"'
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </main>
  );
}
