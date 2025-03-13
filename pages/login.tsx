import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav Bar */}
      <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">FreeTheCork</div>
        <nav>
          {/* Link to Home */}
          <Link href="/" className="text-blue-600 hover:underline mr-4">
            Home
          </Link>
          {/* Could add more nav links here if needed */}
        </nav>
      </header>

      {/* Main Content: Centered Login Form */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 shadow-md rounded w-80">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Log In
            </button>
          </form>

          {/* "Don’t have an account?" link */}
          <div className="mt-4 text-center">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

