"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Slow parallax + ken-burns on the journal hero image. */
export function BlogHeroMedia({ src, alt = "" }: { src: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <motion.div style={{ y, scale }} className="absolute inset-[-8%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </motion.div>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-canvas from-[8%] via-canvas/65 via-[42%] to-transparent to-[78%]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent to-45%"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgb(var(--accent)/0.16),transparent_55%)]"
        aria-hidden
      />
    </div>
  );
}
