import React from 'react';

interface TextMarqueeProps {
  words: string[];
  direction?: 'left' | 'right';
}

/**
 * Renders a marquee of text.
 * - `words` is the array of strings to display.
 * - `direction` = "left" or "right" controls the scroll direction.
 */
export default function TextMarquee({ words, direction = 'left' }: TextMarqueeProps) {
  // Choose which animation class to use
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className="overflow-hidden w-full bg-gray-100 py-4">
      <div className={`flex whitespace-nowrap ${animationClass}`}>
        {/* Duplicate the array for a seamless loop */}
        {[...words, ...words].map((word, idx) => (
          <span key={idx} className="mx-8 text-lg font-semibold text-gray-800">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
