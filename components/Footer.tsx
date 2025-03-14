import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center py-4">
      <p className="text-gray-600">© {new Date().getFullYear()} Free the Cork</p>
    </footer>
  );
}
