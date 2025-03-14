interface TextMarqueeProps {
    words: string[];
    direction?: 'left' | 'right';
  }
  
  export default function TextMarquee({ words, direction = 'right' }: TextMarqueeProps) {
    return (
      <div className="overflow-hidden w-full bg-gray-50 py-6">
        <div
          className={`flex whitespace-nowrap ${
            direction === 'right' ? 'animate-scrollRight' : 'animate-scrollLeft'
          }`}
        >
          {/* First half */}
          <div className="flex space-x-12 px-4">
            {words.map((word, idx) => (
              <span key={idx} className="text-2xl font-semibold text-gray-700">
                {word}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless scroll */}
          <div className="flex space-x-12 px-4">
            {words.map((word, idx) => (
              <span key={`dup-${idx}`} className="text-2xl font-semibold text-gray-700">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  