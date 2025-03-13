import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();

  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Plan selection
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Basic password check
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    // Call register API
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        plan,
        fullName: `${firstName} ${lastName}`,
        address,
        city,
        state,
        zip,
        // Payment data not stored in DB. Demonstration only!
        cardNumber,
        expDate,
        cvc,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Signup complete!');
      // Go to dashboard (user must log in or be auto-logged if you want)
      router.push('/dashboard');
    } else {
      alert(data.error || 'Registration failed');
    }
  }

  function handleCancel() {
    // If user cancels, go back to home page
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email & Password */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {/* Plan selection */}
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
              <label htmlFor="basic" className="ml-2">
                Basic (Free)
              </label>
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
              <label htmlFor="premium" className="ml-2">
                Premium ($9.99/month)
              </label>
            </div>
          </div>

          {/* Personal Info */}
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

          {/* Payment fields if Premium */}
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
                  <label className="block font-semibold mb-1">
                    Expiration (MM/YY)
                  </label>
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

          {/* Buttons at the bottom center */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Complete Sign Up
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
