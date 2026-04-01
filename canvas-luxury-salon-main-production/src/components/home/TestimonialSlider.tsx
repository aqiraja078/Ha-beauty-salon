"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    quote:
      "The attention to detail was impeccable — a traditional yet modern bridal look that stayed flawless all day. I felt like royalty.",
    name: "Ayesha Malik",
    role: "Bridal client",
  },
  {
    quote:
      "The colorist listened and delivered vibrant, healthy hair. The salon’s expertise is unmatched — I’m already planning my next visit.",
    name: "Fizza Khan",
    role: "Color & styling",
  },
  {
    quote:
      "Professional, calm, and thorough. My skin was glowing after the facial — truly a luxury experience from start to finish.",
    name: "Hura Kaleem",
    role: "Facial treatment",
  },
  {
    quote:
      "Party makeup that lasted all night with a lightweight feel. Compliments everywhere — thank you for the confidence boost.",
    name: "Aeman Khan",
    role: "Event makeup",
  },
];

export function TestimonialSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45 }}
          className="glass-panel rounded-2xl px-5 py-8 text-center sm:rounded-3xl sm:px-8 sm:py-10 md:px-12"
        >
          <p className="font-display text-lg leading-relaxed text-white/90 sm:text-xl md:text-2xl">
            “{items[i].quote}”
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-gold">
            {items[i].name}
          </p>
          <p className="mt-1 text-xs text-white/45">{items[i].role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-1 sm:mt-8 sm:gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show testimonial ${idx + 1}`}
            onClick={() => setI(idx)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2"
          >
            <span
              className={`block h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-gold" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
