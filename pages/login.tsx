// pages/login.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center container mx-auto px-4">
        <div className="bg-white p-10 shadow-xl rounded-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-3 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-3 shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-500 font-semibold shadow"
            >
              Log In
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
