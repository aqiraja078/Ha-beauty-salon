"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialSlider({ items }: { items: TestimonialItem[] }) {
  const [i, setI] = useState(0);
  const list = items.length > 0 ? items : [];

  useEffect(() => {
    if (list.length < 2) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % list.length),
      6000
    );
    return () => window.clearInterval(t);
  }, [list.length]);

  if (list.length === 0) return null;

  const current = list[i % list.length];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="card-surface relative overflow-hidden p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 py-7 text-center sm:px-10 sm:py-12 md:px-14"
          >
            <span
              className="mx-auto block font-display text-5xl leading-none text-accent/25"
              aria-hidden
            >
              “
            </span>
            <p className="mt-4 font-display text-lg leading-relaxed text-ink sm:text-xl md:text-2xl">
              {current.quote}
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              {current.name}
            </p>
            <p className="mt-1.5 text-xs text-muted">{current.role}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center gap-1">
        {list.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show testimonial ${idx + 1}`}
            onClick={() => setI(idx)}
            className="flex min-h-[44px] min-w-[36px] items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                idx === i ? "w-9 bg-accent" : "w-2 bg-line hover:bg-muted"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
