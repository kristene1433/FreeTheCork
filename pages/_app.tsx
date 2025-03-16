// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';


export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        {/* Main content grows to fill available space */}
        <main className="flex-1">
          <Component {...pageProps} />
        </main>

       
      </div>
    </SessionProvider>
  );
}



