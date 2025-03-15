import Link from 'next/link';
import TextMarquee from '../components/TextMarquee';
import Marquee from '../components/Marquee';
import Image from 'next/image';

export default function Home() {
  // Removed session usage since not needed
  const wordsRowOne = [
    'Exclusive Wines',
    'Tailored Pairings',
    'Personalized Advice',
    'Local Recommendations',
  ];
  const wordsRowTwo = [
    'Wine Journal',
    'Curated Experiences',
    'Expert Sommeliers',
    'Membership Perks',
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Main Title */}
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

        {/* Feature Highlights Section (moved above membership plans) */}
        <section className="border-t-4 border-gray-300 grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center items-stretch pt-8">
          {/* Box 1: Local Wine Events */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Image
              src="/images/local-wine-events.jpg"
              alt="Local Wine Events"
              width={400}
              height={250}
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Discover Local Wine Events</h3>
              <p className="text-gray-600">Stay updated on tastings, festivals, and wine events in your area.</p>
            </div>
          </div>

          {/* Box 2: Food & Wine Pairings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Image
              src="/images/food-wine-pairing.jpg"
              alt="Food & Wine Pairing"
              width={400}
              height={250}
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Perfect Food & Wine Pairings</h3>
              <p className="text-gray-600">Expert suggestions for pairing wines perfectly with your meals.</p>
            </div>
          </div>

          {/* Box 3: Wine Price Comparisons */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Image
              src="/images/wine-price-comparison.jpg"
              alt="Wine Price Comparison"
              width={400}
              height={250}
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Wine Price Comparisons</h3>
              <p className="text-gray-600">Find the best deals and compare prices of your favorite wines.</p>
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {/* AI Sommelier Plan */}
          <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-800">AI Sommelier</h2>
            <p className="mt-4 text-gray-600 text-center">
              Explore wines, pairings, and personalized recommendations with our powerful AI Sommelier.
            </p>
            <ul className="mt-4 text-left text-gray-700 space-y-2">
              <li>🍷 Personalized wine advice</li>
              <li>💡 General pairing suggestions</li>
              <li>📍 Local availability insights</li>
            </ul>
            <Link
              href="/signup"
              className="mt-6 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Personalized Sommelier Plan */}
          <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center justify-between">
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
            <Link
              href="/pricing"
              className="mt-6 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              View Membership
            </Link>
          </div>
        </section>

        {/* Wine Journal Section (Informational Banner) */}
        <section className="bg-gray-100 rounded-lg shadow-lg flex flex-col md:flex-row items-center p-8 my-12">
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">Your Digital Wine Journal</h3>
            <p className="text-gray-600">
              Track your wine experiences, personal ratings, notes, and preferences all in one
              place—exclusively available to our Personalized Sommelier members.
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

        {/* Image Marquee */}
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

      
    </div>
  );
}
