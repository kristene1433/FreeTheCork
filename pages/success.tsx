// pages/success.tsx

import { useEffect } from 'react';

export default function SuccessPage() {
  

  // Optionally, you might check the session_id from router.query
  // to confirm final subscription status.

  useEffect(() => {
    // poll your server or rely on webhook to confirm user membership
    // then maybe redirect to /dashboard after a few seconds
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-md rounded w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Success!</h1>
        <p>Thank you for subscribing to Premium. Enjoy your AI Sommelier!</p>
      </div>
    </main>
  );
}
