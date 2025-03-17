// pages/privacy.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    // Only set bg-black here (no text-white on parent)
    <div className="flex flex-col min-h-screen bg-black">
      <NavBar />

      {/* Apply text-white on the main content container instead */}
      <main className="flex-grow container mx-auto px-4 py-12 text-white">
        <section className="bg-gray-900 shadow-md rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Introduction</h2>
          <p className="mb-4">
            Free the Cork is committed to protecting your privacy. This Privacy Policy outlines how we
            collect, use, and safeguard your information when you use our AI Sommelier service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
          <p className="mb-4">
            We collect personal information that you voluntarily provide when registering for an account,
            including your name, email address, wine preferences, and payment details when subscribing
            to premium services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-4">
            <li>To personalize your wine recommendations.</li>
            <li>To process transactions securely.</li>
            <li>To send periodic emails and updates regarding new features and offers.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Protection of Your Information</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your personal information. 
            Your payment information is securely handled by our trusted payment processor, Stripe.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Sharing Your Information</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share
            anonymized data with trusted partners to enhance our service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Cookies</h2>
          <p className="mb-4">
            Free the Cork uses cookies to enhance user experience, store preferences, and analyze 
            site usage. You can disable cookies through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Third-Party Links</h2>
          <p className="mb-4">
            Our website may include links to third-party websites. We are not responsible for the 
            privacy practices of external websites.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to This Policy</h2>
          <p className="mb-4">
            We reserve the right to update our Privacy Policy. Changes will be posted on this page, 
            and users will be notified via email where appropriate.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:info@freethecork.com" className="underline">
              support@freethecork.ai
            </a>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

