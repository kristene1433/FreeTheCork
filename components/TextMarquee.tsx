import React from 'react';

interface TextMarqueeProps {
  words: string[];
  direction?: 'left' | 'right';
}

export default function TextMarquee({ words, direction = 'left' }: TextMarqueeProps) {
  return (
    <div className="overflow-hidden w-full bg-gray-100 py-4">
      <div
        className={`flex whitespace-nowrap ${
          direction === 'left'
            ? 'animate-scroll-left'
            : 'animate-scroll-right'
        }`}
      >
        {/* Duplicate the words array for a seamless marquee effect */}
        {[...words, ...words].map((word, idx) => (
          <span key={idx} className="mx-8 font-semibold text-gray-800">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
