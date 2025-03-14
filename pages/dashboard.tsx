"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import Link from 'next/link';

// Extend NextAuth user to include 'membership'
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  membership?: string; // e.g. "premium", "free", ...
}

// Each chat entry is either user or bot
interface ChatEntry {
  role: "user" | "bot";
  text: string;  // AI's response can be Markdown, while user's text is plain
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  // We'll store the typed user reference here
  const user = session?.user as ExtendedUser | undefined;
  // If membership is "premium", we display the Preferences link
  const isPremium = user?.membership === "premium";

  const [prompt, setPrompt] = useState("");
  const [responseHistory, setResponseHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        Redirecting...
      </div>
    );
  }

  async function handleChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Add the user's prompt as a 'user' role entry
    setResponseHistory(prev => [
      ...prev,
      { role: "user", text: prompt },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.answer) {
        setResponseHistory(prev => [
          ...prev,
          { role: "bot", text: data.answer },
        ]);
      } else {
        setResponseHistory(prev => [
          ...prev,
          { role: "bot", text: `⚠️ Error: ${data.error}` },
        ]);
      }
    } catch (err) {
      console.error(err);
      setResponseHistory(prev => [
        ...prev,
        { role: "bot", text: "⚠️ An error occurred." },
      ]);
    }

    setPrompt("");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="bg-white shadow w-full">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🍷 AI Sommelier Chat</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">
              Logged in as {user?.email}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        {/* Chat History */}
        <div className="bg-white shadow rounded p-4 h-96 overflow-y-auto border">
          {responseHistory.length > 0 ? (
            responseHistory.map((entry, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  entry.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <strong>{entry.role === "user" ? "You" : "🍷"}</strong>
                <div className="mt-2 text-gray-900">
                  {entry.role === "bot" ? (
                    <ReactMarkdown
                      components={{
                        a: ({ ...props }) => (
                          <a {...props} className="underline text-blue-600" />
                        ),
                      }}
                    >
                      {entry.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {entry.text}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">
              Ask the AI Sommelier a question to get started!
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleChat} className="mt-4 flex space-x-2 w-full">
          <input
            className="border rounded p-3 w-full shadow-sm"
            placeholder="Ask about wine..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-500 shadow-md"
            disabled={loading}
          >
            {loading ? "🍷 Thinking..." : "Ask AI"}
          </button>
        </form>

        {/* Preferences Link if Premium, Otherwise Prompt to Upgrade */}
        <div className="mt-6 text-center">
          {isPremium ? (
            <Link href="/preferences">
              <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 shadow-md">
                Edit Your Preferences
              </button>
            </Link>
          ) : (
            <div className="text-gray-700">
              <p>You are on the Free plan. Upgrade to unlock personalized preferences.</p>
              <Link href="/upgrade">
                <button className="mt-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 shadow-md">
                  Upgrade Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

