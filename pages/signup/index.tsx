// pages/signup.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        plan,
        fullName: plan === 'premium' ? `${firstName} ${lastName}` : '',
        address: plan === 'premium' ? address : '',
        city: plan === 'premium' ? city : '',
        state: plan === 'premium' ? state : '',
        zip: plan === 'premium' ? zip : '',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    if (plan === 'basic') {
      alert('Signup complete! Welcome to the Basic plan.');
      router.push('/dashboard');
      return;
    }

    try {
      const checkoutRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        alert('Error creating checkout session');
      }
    } catch (err) {
      console.error('Checkout session error:', err);
      alert('Network/server error creating checkout session');
    }
  }

  function handleCancel() {
    router.push('/');
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavBar />

      {/* Add top and bottom padding for extra vertical space */}
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="mx-auto max-w-3xl bg-white rounded shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

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
                  Basic ($0/month)
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

            {/* Personal Info - only show if 'premium' */}
            {plan === 'premium' && (
              <>
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
              </>
            )}

            {/* Buttons */}
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
    </div>
  );
}
