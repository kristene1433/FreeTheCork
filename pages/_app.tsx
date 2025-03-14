// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <NavBar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}


