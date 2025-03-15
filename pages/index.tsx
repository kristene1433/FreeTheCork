import Link from 'next/link';
import TextMarquee from '../components/TextMarquee';
import Marquee from '../components/Marquee';
import Image from 'next/image';

export default function Home() {
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
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Main Title */}
        <h1 className="text-5xl font-bold text-center mb-4 text-white">
          Uncork Your Personalized Wine Journey
        </h1>
        <p className="text-xl text-gray-300 text-center mb-8">
          Expert AI-powered sommelier advice tailored exclusively for you.
        </p>

        {/* Text Marquees */}
        <div className="my-8 bg-gray-800 rounded-lg shadow py-6 px-4">
          <TextMarquee 
            words={wordsRowOne}
            direction="left"
            className="text-white text-xl font-semibold"
          />
          <TextMarquee 
            words={wordsRowTwo}
            direction="right"
            className="text-gray-300 text-xl font-semibold mt-4"
          />
        </div>

        {/* Feature Highlights Section */}
        <section className="border-t-4 border-gray-600 grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center pt-8">
          {['local-wine-events', 'food-wine-pairing', 'wine-price-comparison'].map((img, i) => (
            <div key={i} className="bg-gray-900 rounded-lg shadow overflow-hidden">
              <Image
                src={`/images/${img}.jpg`}
                alt={img}
                width={400}
                height={250}
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {['Discover Local Wine Events', 'Perfect Food & Wine Pairings', 'Wine Price Comparisons'][i]}
                </h3>
                <p className="text-gray-300">
                  {[
                    'Stay updated on tastings, festivals, and wine events in your area.',
                    'Expert suggestions for pairing wines perfectly with your meals.',
                    'Find the best deals and compare prices of your favorite wines.',
                  ][i]}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Membership Plans */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {["AI Sommelier", "Personalized Sommelier"].map((plan, idx) => (
            <div key={idx} className="bg-gray-900 shadow-xl rounded-lg p-8 flex flex-col items-center justify-between">
              <h2 className="text-3xl font-semibold text-white">{plan}</h2>
              <p className="mt-4 text-gray-300 text-center">
                {idx === 0 
                  ? "Explore wines, pairings, and personalized recommendations with our powerful AI Sommelier."
                  : "Unlock your personal wine expert with detailed taste profiling and exclusive perks."
                }
              </p>
              <ul className="mt-4 text-gray-300 space-y-2">
                {idx === 0 ? (
                  <>
                    <li>🍷 Personalized wine advice</li>
                    <li>💡 General pairing suggestions</li>
                    <li>📍 Local availability insights</li>
                  </>
                ) : (
                  <>
                    <li>🥂 Comprehensive taste profiling</li>
                    <li>📖 Exclusive digital wine journal</li>
                    <li>🎁 Curated wine experiences</li>
                    <li>🗺️ Customized local recommendations</li>
                    <li>🌟 Priority sommelier support</li>
                  </>
                )}
              </ul>
              <Link
                href={idx === 0 ? "/signup" : "/pricing"}
                className="mt-6 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                {idx === 0 ? "Sign Up Free" : "View Membership"}
              </Link>
            </div>
          ))}
        </section>

        {/* Wine Journal Section */}
        <section className="bg-gray-800 rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between p-10 my-12">
          <div className="text-white md:mr-8">
            <h3 className="text-3xl font-semibold mb-4">Your Digital Wine Journal</h3>
            <p className="text-gray-300 text-lg">
              Track your wine experiences, personal ratings, notes, and preferences—all in one place.<br/>
              Exclusively for <span className="font-bold">Personalized Sommelier</span> members.
            </p>
          </div>
          <Image
            src="/images/wine-journal.jpg"
            alt="Wine Journal"
            width={400}
            height={250}
            className="rounded-xl shadow-2xl"
          />
        </section>

        {/* Image Marquee */}
        <div className="my-8">
          <Marquee images={["/images/ChateauD'YquemSauternes2016.jpg", "/images/GrahamsVintagePort2020.jpg", "/images/OsbornePedroXimenez.jpg"]}/>
        </div>
      </main>
    </div>
  );
}