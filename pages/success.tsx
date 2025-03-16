// pages/success.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // After 3 seconds, redirect to /dashboard
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    // Cleanup timer if component unmounts before time is up
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 shadow-md rounded w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Success!</h1>
        <p>Thank you for subscribing to Premium. Enjoy your AI Sommelier!</p>
      </div>
    </main>
  );
}

