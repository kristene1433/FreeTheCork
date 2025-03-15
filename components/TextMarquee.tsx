import React from 'react';

interface TextMarqueeProps {
  words: string[];
  direction?: 'left' | 'right';
  className?: string; // added to accept custom styles
}

/**
 * Renders a marquee of text.
 * - `words` is the array of strings to display.
 * - `direction` = "left" or "right" controls the scroll direction.
 * - `className` allows custom styling.
 */
export default function TextMarquee({
  words,
  direction = 'left',
  className = '', // default to empty string
}: TextMarqueeProps) {
  // Choose which animation class to use
  const animationClass =
    direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className={`overflow-hidden w-full py-4 ${className}`}>
      <div className={`flex whitespace-nowrap ${animationClass}`}>
        {/* Duplicate the array for a seamless loop */}
        {[...words, ...words].map((word, idx) => (
          <span key={idx} className="mx-8 text-lg font-semibold">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
