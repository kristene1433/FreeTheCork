// pages/about.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="bg-white shadow-md rounded-lg p-8 md:p-12 lg:flex lg:items-center">
          <div className="lg:w-1/3">
            <Image
              src="/images/KrissyHeadshot.jpg"
              alt="Profile Image"
              width={300}
              height={300}
              className="rounded-full object-cover mx-auto shadow-lg"
            />
          </div>

          <div className="lg:w-2/3 lg:pl-12 mt-8 lg:mt-0">
            <h1 className="text-4xl font-bold mb-4">Meet Our Sommelier</h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              Krissy is a Certified Sommelier with the Court of Masters Sommeliers and holds a WSET Level III Certification. With a degree in computer programming, she uniquely combines her deep expertise in wine and technology. Krissy&apos;s innovative approach has resulted in the creation of Free the Cork, your personalized AI Sommelier designed to deliver expert wine recommendations tailored to your tastes.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Her professional journey began in Tampa, Florida, and has taken her to Los Angeles, California, where she continues to blend her passion for wine education and technology. Through Free the Cork, Krissy is dedicated to making wine knowledge accessible and enjoyable for wine enthusiasts of all levels. She continually introduces new features and expands educational resources to enhance your personalized wine experience.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
