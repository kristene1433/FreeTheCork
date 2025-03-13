// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-100 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Free the Cork. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  