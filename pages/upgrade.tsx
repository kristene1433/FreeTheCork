// pages/upgrade.tsx

import { useEffect, useState, FormEvent } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function UpgradePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If user is not logged in, prompt them to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  const [plan, setPlan] = useState<'basic' | 'premium'>('basic');

  // Payment fields (demo only)
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');

  // On first load, set plan based on user's current membership
  useEffect(() => {
    if (session?.user?.membership === 'premium') {
      setPlan('premium');
    } else {
      setPlan('basic');
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    // Not signed in or redirecting
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // In production, you'd handle real payment with Stripe or similar.
    try {
      const res = await fetch('/api/account/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPlan: plan,
          // cardNumber, expDate, cvc (demo only – not actually used server-side)
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Plan updated to ${data.membership}!`);
        router.push('/dashboard');
      } else {
        alert(data.error || 'Error updating plan');
      }
    } catch (err) {
      console.error(err);
      alert('Network or server error');
    }
  }

  function handleCancel() {
    // If user cancels, just go back to dashboard
    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Your Plan</h1>
        <form onSubmit={handleSubmit} className="flex">
          {/* LEFT COLUMN: Plan choices */}
          <div className="w-1/2 pr-8 border-r space-y-4">
            <label className="block font-semibold mb-1">Select Your Plan</label>

            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="basic"
                name="plan"
                value="basic"
                checked={plan === 'basic'}
                onChange={() => setPlan('basic')}
              />
              <label htmlFor="basic" className="ml-2">Basic (Free)</label>
            </div>
            <p className="ml-6 text-sm text-gray-600 mb-4">
              Minimal features, no personalized preferences.
            </p>

            <div className="flex items-center">
              <input
                type="radio"
                id="premium"
                name="plan"
                value="premium"
                checked={plan === 'premium'}
                onChange={() => setPlan('premium')}
              />
              <label htmlFor="premium" className="ml-2">Premium ($9.99/month)</label>
            </div>
            <p className="ml-6 text-sm text-gray-600">
              Unlimited AI queries, personalized wine preferences.
            </p>
          </div>

          {/* RIGHT COLUMN: Payment info if premium */}
          <div className="w-1/2 pl-8">
            <h2 className="text-lg font-semibold mb-4">Payment Info</h2>

            {plan === 'premium' ? (
              <>
                <div>
                  <label className="block font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block font-semibold mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  (Demo only—use a secure payment provider in production.)
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                No payment required for Basic (Free) plan.
              </p>
            )}

            {/* Submit / Cancel Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Update Plan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel &amp; Return
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
