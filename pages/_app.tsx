import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Determine whether we’re on the dashboard route
  const isDashboard = router.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Conditionally render NavBar unless we're on /dashboard */}
      {!isDashboard && <NavBar />}

      <main className="flex-1 container mx-auto px-4 py-12">
        <Component {...pageProps} />
      </main>

      {/* Also conditionally render Footer if you want to hide that too */}
      {!isDashboard && <Footer />}
    </div>
  );
}


