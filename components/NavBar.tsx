// components/NavBar.tsx
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or Site Name */}
        <div className="text-xl font-bold">Free the Cork</div>

        {/* Nav Links and Auth Buttons */}
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
  );
}

