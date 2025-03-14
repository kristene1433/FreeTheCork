// pages/signup/plan.tsx

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SignupStepTwo() {
  const router = useRouter();
  const { email, password } = router.query;

  // If user tries accessing /signup/plan without step 1, redirect them
  useEffect(() => {
    if (!email || !password) {
      router.push('/signup');
    }
  }, [email, password, router]);

  // Membership plan
  const [plan, setPlan] = useState<'basic' | 'premium'>('basic');

  // Personal info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Payment info (demo only)
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Additional preference fields (optional)
  const [wineKnowledgeLevel, setWineKnowledgeLevel] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [dietRestrictions, setDietRestrictions] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Build up the final data object
    const userData = {
      email,
      password,
      plan,
      fullName: `${firstName} ${lastName}`,
      address: `${address}, ${city}, ${state} ${zip}`,
      cardNumber,
      expDate,
      cvc,
      // Additional preferences
      wineKnowledgeLevel,
      budgetRange,
      dietRestrictions,
    };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Signup complete!');
      router.push('/dashboard'); // Go straight to the dashboard
    } else {
      alert(data.error || 'Registration failed');
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded shadow-md flex">
        {/* Left Column: Plan descriptions */}
        <div className="w-1/2 p-8 border-r">
          <h2 className="text-2xl font-bold mb-4">Membership Plans</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">Basic (Free)</h3>
            <p className="text-sm text-gray-600">
              Ideal for casual wine explorers—basic recommendations and limited queries.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">Premium ($9.99/month)</h3>
            <p className="text-sm text-gray-600">
              Perfect for wine enthusiasts—unlimited queries, personalized advice, and exclusive deals.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Upgrade or downgrade anytime in your Dashboard.
          </p>
        </div>

        {/* Right Column: Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Your Details (Step 2)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Selection */}
            <div>
              <label className="block font-semibold mb-1">Choose Your Plan</label>
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
            </div>

            {/* First & Last Name */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Address, City, State, Zip */}
            <div>
              <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="w-16">
                <label className="block font-semibold mb-1">State</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="w-24">
                <label className="block font-semibold mb-1">ZIP</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>

            {/* Payment fields only if plan === 'premium' */}
            {plan === 'premium' && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
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
                <div className="flex space-x-2 mt-2">
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
                  (Demo only—do not store real card data. Use a secure payment provider!)
                </p>
              </div>
            )}

            {/* Additional Preferences */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">Wine Preferences (Optional)</h3>

              <div className="mb-2">
                <label className="block font-semibold mb-1">Wine Knowledge Level</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={wineKnowledgeLevel}
                  onChange={(e) => setWineKnowledgeLevel(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block font-semibold mb-1">Budget Range</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="$10-20">$10-20</option>
                  <option value="$20-40">$20-40</option>
                  <option value="$40+">$40+</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block font-semibold mb-1">Dietary Restrictions</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="e.g., vegetarian, vegan, none"
                  value={dietRestrictions}
                  onChange={(e) => setDietRestrictions(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500 mt-4"
            >
              Complete Sign Up
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
