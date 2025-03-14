import { useSession } from 'next-auth/react';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import TextMarquee from '../components/TextMarquee';
import Marquee from '../components/Marquee';
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();

  // Words for the two text marquees
  const wordsRowOne = ['Exclusive Wines', 'Tailored Pairings', 'Personalized Advice', 'Local Recommendations'];
  const wordsRowTwo = ['Wine Journal', 'Curated Experiences', 'Expert Sommeliers', 'Membership Perks'];

  return (
    // 1) Added a light gray background to the entire page
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Headline */}
        <h1 className="text-5xl font-bold text-center mb-4">
          Uncork Your Personalized Wine Journey
        </h1>
        <p className="text-xl text-gray-700 text-center mb-8">
          Expert AI-powered sommelier advice tailored exclusively for you.
        </p>

        {/* Text Marquees */}
        <div className="my-8">
          <TextMarquee words={wordsRowOne} direction="left" />
          <TextMarquee words={wordsRowTwo} direction="right" />
        </div>

        {/* 2) Three-feature section (smaller boxes, uniform alignment) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center items-stretch">
          {/* Card 1: Local Wine Events */}
          <div className="bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <Image
              src="/images/local-wine-events.jpg"
              alt="Local Wine Events"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 bg-gray-50 flex-1 flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Discover Local Wine Events</h3>
              <p className="text-gray-600">
                Stay updated on tastings, festivals, and wine events happening in your community.
              </p>
            </div>
          </div>

          {/* Card 2: Food & Wine Pairing */}
          <div className="bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <Image
              src="/images/food-wine-pairing.jpg"
              alt="Food & Wine Pairing"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 bg-gray-50 flex-1 flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Perfect Food & Wine Pairings</h3>
              <p className="text-gray-600">
                Receive expert suggestions for pairing wines perfectly with your favorite dishes.
              </p>
            </div>
          </div>

          {/* Card 3: Wine Price Comparison */}
          <div className="bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <Image
              src="/images/wine-price-comparison.jpg"
              alt="Wine Price Comparison"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 bg-gray-50 flex-1 flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Wine Price Comparisons</h3>
              <p className="text-gray-600">
                Compare prices and discover the best deals on your favorite wines.
              </p>
            </div>
          </div>
        </section>

        {/* Membership Plans Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {/* Limited Sommelier Plan */}
          <div className="bg-gray-50 shadow-xl rounded-lg p-8 flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-gray-800">Limited Sommelier</h2>
            <p className="mt-4 text-gray-600 text-center">
              Explore wine pairings and get basic personalized recommendations.
            </p>
            <ul className="mt-4 text-left text-gray-700 space-y-2">
              <li>🍷 Basic wine pairings</li>
              <li>💡 General sommelier advice</li>
            </ul>
            <Link href="/signup" className="mt-6 py-2 px-6 bg-gray-800 text-white rounded hover:bg-gray-700">
              Sign Up Free
            </Link>
          </div>

          {/* Personalized Sommelier Plan */}
          <div className="bg-gray-50 shadow-xl rounded-lg p-8 flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-gray-800">Personalized Sommelier</h2>
            <p className="mt-4 text-gray-600 text-center">
              Unlock your personal wine expert with detailed taste profiling and exclusive perks.
            </p>
            <ul className="mt-4 text-left text-gray-700 space-y-2">
              <li>🥂 Comprehensive taste profiling</li>
              <li>📖 Exclusive digital wine journal</li>
              <li>🎁 Curated wine experiences</li>
              <li>🗺️ Customized local recommendations</li>
              <li>🌟 Priority sommelier support</li>
            </ul>
            <Link href="/pricing" className="mt-6 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500">
              View Membership
            </Link>
          </div>
        </section>

        {/* User Sign-in/Sign-up or Dashboard */}
        {!session ? (
          <section className="text-center my-12">
            <h3 className="text-3xl font-semibold text-gray-800">Start Your Wine Adventure Today!</h3>
            <p className="text-gray-600 my-4">
              Join now to begin exploring wine recommendations tailored just for you.
            </p>
            <Link href="/signup" className="py-2 px-6 bg-green-600 text-white rounded hover:bg-green-500">
              Get Started
            </Link>
          </section>
        ) : (
          <section className="text-center my-12">
            <h3 className="text-3xl font-semibold text-gray-800">Welcome back, wine lover!</h3>
            <Link
              href="/dashboard"
              className="mt-4 py-2 px-6 bg-green-600 text-white rounded hover:bg-green-500 inline-block"
            >
              Go to Your Dashboard
            </Link>
          </section>
        )}

        {/* Image Marquee */}
        <div className="my-8">
          <Marquee
            images={[
              \"/images/ChateauD'YquemSauternes2016.jpg\",
              '/images/GrahamsVintagePort2020.jpg',
              '/images/OsbornePedroXimenez.jpg',
            ]}
          />
        </div>

        {/* Informational Banner */}
        <section className="bg-gray-100 rounded-lg shadow-lg flex flex-col md:flex-row items-center p-8 my-12">
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">Your Digital Wine Journal</h3>
            <p className="text-gray-600">
              Track your wine experiences, personal ratings, notes, and preferences all in one place—
              exclusively available to our Personalized Sommelier members.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image 
              src="/images/wine-journal.jpg" 
              alt="Wine Journal"
              width={300}
              height={200}
              className="rounded-lg shadow"
            />
          </div>
        </section>

        {/* Call-to-action */}
        <section className="bg-blue-600 rounded-lg shadow-xl text-center p-8 my-12">
          <h3 className="text-3xl text-white font-bold">
            Ready to Personalize Your Wine Experience?
          </h3>
          <p className="text-blue-100 my-4">
            Become a member today and start your journey.
          </p>
          <Link
            href="/pricing"
            className="py-3 px-8 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Explore Membership
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4">
        <p className="text-gray-600">© {new Date().getFullYear()} Free the Cork</p>
      </footer>
    </div>
  );
}
