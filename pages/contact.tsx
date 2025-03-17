// pages/contact.tsx
import React, { FormEvent, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Implement your sending logic here (e.g., via an API route)
    alert('Thank you for contacting us! We will get back to you shortly.');
    
    // Clear form
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-12 text-white">
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-300 mb-8">
            Have a question, comment, or just want to say hello? Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2 font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                placeholder="Your Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                rows={5}
                placeholder="Your Message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded focus:outline-none focus:bg-green-500"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
