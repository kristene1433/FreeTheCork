// pages/index.tsx

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Marquee from "../components/Marquee";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Free the Cork</div>
          <div className="flex items-center space-x-4">
            <Link href="/pricing" className="text-gray-700 hover:underline">
              Pricing
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:underline">
                  Dashboard
                </Link>
                <button
                  className="py-1 px-3 bg-gray-800 text-white rounded hover:bg-gray-700"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="py-1 px-3 bg-gray-800 text-white rounded hover:bg-gray-700"
                  onClick={() => signIn()}
                >
                  Sign In
                </button>
                <Link
                  href="/signup"
                  className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Free the Cork</h1>
        <p className="text-lg text-gray-700 mb-4">
          Your personal AI Sommelier is here to help you discover and enjoy the best wines
          tailored to your taste and budget.
        </p>

        {/* Sign-in/Sign-up or Dashboard link */}
        {!session ? (
          <div className="mt-6">
            <p className="mb-2">Ready to begin your wine journey?</p>
            <div className="space-x-2">
              <button
                className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700"
                onClick={() => signIn()}
              >
                Sign In
              </button>
              <Link
                href="/signup"
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="mb-2">You are logged in as {session.user?.email}.</p>
            <Link
              href="/dashboard"
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Marquee */}
        <div className="my-8">
          <Marquee
            images={[
              "/images/ChateauD'YquemSauternes2016.jpg",
              "/images/GrahamsVintagePort2020.jpg",
              "/images/OsbornePedroXimenez.jpg",
            ]}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 text-center py-4 mt-auto">
        <p className="text-gray-600">© {new Date().getFullYear()} Free the Cork</p>
      </footer>
    </div>
  );
}
