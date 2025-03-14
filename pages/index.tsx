import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Marquee from '../components/Marquee';
import NavBar from '../components/NavBar';
import TextMarquee from '../components/TextMarquee';

export default function Home() {
  const { data: session } = useSession();

  // Words for the top row
  const wordsRowOne = [
    'VIRNIKA', 'EVERYWHERE', 'FOLIO', 'Rings', 'VOW'
  ];

  // Words for the bottom row
  const wordsRowTwo = [
    'Grapefruit', 'mitivate', 'nextview', 'downland', 'techstars_'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

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
              <Link
                href="/login"
                className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Sign In
              </Link>
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

        {/* Text marquees */}
        <div className="my-8">
          {/* Top marquee => moves right */}
          <TextMarquee words={wordsRowOne} direction="right" />

          {/* Bottom marquee => moves left */}
          <TextMarquee words={wordsRowTwo} direction="left" />
        </div>

        {/* Existing Image Marquee */}
        <div className="my-8">
          <Marquee
            images={[
              "/images/ChateauD'YquemSauternes2016.jpg",
              '/images/GrahamsVintagePort2020.jpg',
              '/images/OsbornePedroXimenez.jpg',
            ]}
          />
        </div>
      </main>

      <footer className="bg-gray-100 text-center py-4 mt-auto">
        <p className="text-gray-600">© {new Date().getFullYear()} Free the Cork</p>
      </footer>
    </div>
  );
}
