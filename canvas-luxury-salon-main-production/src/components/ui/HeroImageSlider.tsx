"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface HeroImageSliderProps {
  images: string[];
  alt?: string;
}

export function HeroImageSlider({ images, alt = "" }: HeroImageSliderProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (images.length < 2) return;
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative h-full w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.1, ease: "easeInOut" },
            scale: { duration: 6.5, ease: "easeOut" },
          }}
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-5 right-5 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-7 bg-accent" : "w-1.5 bg-ink/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
