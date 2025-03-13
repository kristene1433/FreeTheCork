import Link from 'next/link';

export default function CancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-md p-6 rounded text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p className="mb-4">
          You have not been charged. You still have access to our Basic plan.
          Upgrade anytime from your dashboard.
        </p>
        <Link href="/dashboard">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Return to Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
