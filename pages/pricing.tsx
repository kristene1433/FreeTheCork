import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar';

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavBar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Pricing</h1>
        <p className="text-gray-300 text-center mb-8">
          Choose a plan that suits your wine journey!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-2">Basic</h2>
            <p className="text-3xl font-bold text-center mb-6">
              Free <span className="text-sm font-normal">/ month</span>
            </p>
            <ul className="text-gray-600 mb-8 flex-grow list-disc pl-5 space-y-2">
              <li>5 AI queries per day</li>
              <li>Basic wine pairing suggestions</li>
            </ul>
            {!session ? (
              <Link
                href="/signup"
                className="bg-gray-800 text-white text-center py-2 rounded-lg hover:bg-gray-700"
              >
                Sign Up
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-500"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-2">Premium</h2>
            <p className="text-3xl font-bold text-center mb-6">
              $9.99 <span className="text-sm font-normal">/ month</span>
            </p>
            <ul className="text-gray-600 mb-8 flex-grow list-disc pl-5 space-y-2">
              <li>Unlimited AI wine recommendations</li>
              <li>Advanced pairing &amp; personalized suggestions</li>
              <li>Exclusive Digital Wine Journal access</li>
              <li>Local wine availability search</li>
              <li>Expert sommelier insights &amp; curated collections</li>
              <li>Priority customer support</li>
              <li>Early access to new features</li>
            </ul>
            {!session ? (
              <Link
                href="/signup"
                className="bg-gray-800 text-white text-center py-2 rounded-lg hover:bg-gray-700"
              >
                Sign Up
              </Link>
            ) : (
              <button
                onClick={() => alert('Stripe checkout goes here')}
                className="bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-500"
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
