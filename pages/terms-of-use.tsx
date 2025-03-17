// pages/terms-of-use.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-black flex flex-col text-white">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="bg-gray-900 shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using Free the Cork, you agree to comply with and be bound by these Terms of Use. 
            If you disagree with any part of these terms, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-6">
            Free the Cork provides personalized AI-powered wine recommendations, education, and related content. 
            We reserve the right to modify or discontinue our services at any time, with or without notice.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-6">
            Users must be of legal drinking age in their jurisdiction. Users agree to provide accurate, 
            current, and complete information during registration and to update information promptly when necessary.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Membership and Subscriptions</h2>
          <p className="mb-6">
            We offer various membership plans, including a free Basic plan and a paid Premium plan. 
            Paid memberships are billed monthly and provide additional features. Users can change 
            or cancel their plans at any time.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Privacy Policy</h2>
          <p className="mb-6">
            Your privacy is important to us. Please review our Privacy Policy page to understand how 
            we collect, use, and safeguard your information.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Intellectual Property Rights</h2>
          <p className="mb-6">
            All content and technology associated with Free the Cork, including AI systems, content, 
            graphics, logos, and trademarks, are the property of Free the Cork and protected by intellectual 
            property laws.
          </p>

          <h2 className="text-xl font-semibold mb-4">7. Restrictions</h2>
          <p className="mb-6">
            You agree not to misuse our service, including attempts to access our systems unlawfully, 
            engage in fraudulent behavior, or reproduce, sell, or exploit any content without prior written permission.
          </p>

          <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-6">
            Free the Cork shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising out of or related to your use or inability to use our service.
          </p>

          <h2 className="text-xl font-semibold mb-4">9. Modifications of Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these Terms at any time. Any changes will be effective 
            immediately upon posting. Your continued use of Free the Cork constitutes acceptance 
            of the revised terms.
          </p>

          <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be governed by and construed in accordance with the laws of the 
            State of California, United States, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have questions or concerns about these Terms, please contact us at 
            <span className="ml-1 underline">support@freethecork.com</span>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
