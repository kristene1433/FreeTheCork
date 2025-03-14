// components/Marquee.tsx
import Image from 'next/image';

interface MarqueeProps {
  images: string[];
}

export default function Marquee({ images }: MarqueeProps) {
  return (
    <div className="overflow-hidden w-full bg-gray-100 py-4">
      <div className="flex w-[200%] animate-scroll">
        {/* First half */}
        <div className="flex w-1/2 justify-around">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Marquee image ${idx}`}
              width={150}
              height={150}
              className="mx-4 object-cover"
            />
          ))}
        </div>
        {/* Second half (duplicate for seamless scroll) */}
        <div className="flex w-1/2 justify-around">
          {images.map((img, idx) => (
            <Image
              key={`dup-${idx}`}
              src={img}
              alt={`Marquee image duplicate ${idx}`}
              width={150}
              height={150}
              className="mx-4 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
