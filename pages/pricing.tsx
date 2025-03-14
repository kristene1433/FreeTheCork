// pages/pricing.tsx
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="text-gray-700 mb-8">Choose a plan that suits your wine journey!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Basic</h2>
          <p className="text-2xl font-bold">$0 <span className="text-sm">/ month</span></p>
          <ul className="text-gray-600 mt-4 mb-6">
            <li>• 5 AI queries per day</li>
            <li>• Basic pairing suggestions</li>
          </ul>
          {!session ? (
            <Link
              href="/signup"
              className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Sign Up
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Premium</h2>
          <p className="text-2xl font-bold">$9.99 <span className="text-sm">/ month</span></p>
          <ul className="text-gray-600 mt-4 mb-6">
            <li>• Unlimited AI queries</li>
            <li>• Advanced pairing & personal wine suggestions</li>
          </ul>
          {!session ? (
            <Link
              href="/signup"
              className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Sign Up
            </Link>
          ) : (
            <button
              onClick={() => alert('Stripe checkout goes here')}
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
