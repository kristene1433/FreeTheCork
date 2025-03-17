// components/Footer.tsx
import React from "react";
import { Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left side: text links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/about">
            <span className="hover:underline">About Us</span>
          </Link>
          <Link href="/privacy">
            <span className="hover:underline">Privacy Policy</span>
          </Link>
          <Link href="/terms-of-use">
            <span className="hover:underline">Terms of Use</span>
          </Link>
          <Link href="/contact">
            <span className="hover:underline">Contact</span>
          </Link>
        </div>

        {/* Center: Copyright */}
        <div className="text-sm mb-4 md:mb-0">
          Free the Cork © 2025
        </div>

        {/* Right side: social icons */}
        <div className="flex space-x-4">
          <Link
            href="https://x.com/FreeTheCork"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-6 w-6 hover:text-gray-300" />
          </Link>
          <Link
            href="https://www.instagram.com/freethecork.ai/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="h-6 w-6 hover:text-gray-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
