"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroImageSliderProps {
  images: string[];
  alt?: string;
}

export function HeroImageSlider({ images, alt = "" }: HeroImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={alt}
          fill
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          priority={index === 0}
        />
      ))}
      {/* Optional: Add dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}