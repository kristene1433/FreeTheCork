"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function UpgradePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If user is not logged in, prompt them to sign in
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // Current membership from session
  const currentMembership = session?.user?.membership || "basic";

  // Radio button to keep track of the selected plan
  const [plan, setPlan] = useState<"basic" | "premium">(
    currentMembership === "premium" ? "premium" : "basic"
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    // Not signed in or still redirecting
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (plan === "basic") {
        // 1) Downgrade (or remain) to Basic:
        const res = await fetch("/api/account/upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // IMPORTANT: include credentials so session cookie is sent
          credentials: "same-origin",
          body: JSON.stringify({ newPlan: "basic" }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Error updating plan");
          return;
        }

        alert("You are now on the Basic plan.");
        router.push("/dashboard");
      } else {
        // 2) If plan = 'premium', create a Stripe checkout session
        const checkoutRes = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          credentials: "same-origin", // Include cookies here too if you need session
        });

        const checkoutData = await checkoutRes.json();
        if (!checkoutRes.ok || !checkoutData.url) {
          alert(checkoutData.error || "Error creating checkout session");
          return;
        }

        // Redirect to Stripe payment page
        window.location.href = checkoutData.url;
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error. See console.");
    }
  }

  function handleCancel() {
    // If user cancels, go back to the dashboard
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Your Plan</h1>
        <form onSubmit={handleSubmit} className="flex">
          {/* LEFT COLUMN: Plan choices */}
          <div className="w-1/2 pr-8 border-r space-y-4">
            <label className="block font-semibold mb-1">Select Your Plan</label>

            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="basic"
                name="plan"
                value="basic"
                checked={plan === "basic"}
                onChange={() => setPlan("basic")}
              />
              <label htmlFor="basic" className="ml-2">
                Basic (Free)
              </label>
            </div>
            <p className="ml-6 text-sm text-gray-600 mb-4">
              Minimal features, no personalized preferences.
            </p>

            <div className="flex items-center">
              <input
                type="radio"
                id="premium"
                name="plan"
                value="premium"
                checked={plan === "premium"}
                onChange={() => setPlan("premium")}
              />
              <label htmlFor="premium" className="ml-2">
                Premium ($9.99/month)
              </label>
            </div>
            <p className="ml-6 text-sm text-gray-600">
              Unlimited queries, personalized preferences, and more.
            </p>
          </div>

          {/* RIGHT COLUMN: Explanation / Payment Info */}
          <div className="w-1/2 pl-8">
            <h2 className="text-lg font-semibold mb-4">Payment Info</h2>

            {plan === "premium" ? (
              <p className="text-sm text-gray-700">
                Upon submission, you’ll be redirected to our secure Stripe
                checkout. No payment data is collected here.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                No payment required for Basic (Free) plan.
              </p>
            )}

            {/* Submit / Cancel Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Update Plan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel &amp; Return
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
