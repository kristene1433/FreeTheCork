import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar';

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* NavBar at the top */}
      <NavBar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-gray-700 text-center mb-8">Choose a plan that suits your wine journey!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Basic</h2>
            <p className="text-2xl font-bold">$0 <span className="text-sm">/ month</span></p>
            <ul className="text-gray-600 mt-4 mb-6 flex-grow text-center">
              <li>• 5 AI queries per day</li>
              <li>• Basic pairing suggestions</li>
            </ul>
            {!session ? (
              <Link
                href="/signup"
                className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Sign Up
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Premium Plan (Expanded) */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Premium</h2>
            <p className="text-2xl font-bold">$9.99 <span className="text-sm">/ month</span></p>
            <ul className="text-gray-600 mt-4 mb-6 flex-grow text-center">
              <li>• **Unlimited AI queries** for wine recommendations</li>
              <li>• **Advanced pairing & personalized wine suggestions** based on your taste profile</li>
              <li>• **Exclusive access to the Digital Wine Journal** to track your tasting experiences</li>
              <li>• **Local wine availability finder** for purchasing nearby</li>
              <li>• **Expert sommelier insights** and curated wine collections</li>
              <li>• **Priority customer support** and early access to new features</li>
            </ul>
            {!session ? (
              <Link
                href="/signup"
                className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Sign Up
              </Link>
            ) : (
              <button
                onClick={() => alert('Stripe checkout goes here')}
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
