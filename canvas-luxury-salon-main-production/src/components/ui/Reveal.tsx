"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const ease = [0.22, 1, 0.36, 1] as const;

function offset(from: Direction, distance: number) {
  switch (from) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  from?: Direction;
  /** Slight scale-in for cards */
  scale?: boolean;
  /** Soft blur-in for headline blocks */
  blur?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  from = "up",
  scale,
  blur,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const { x, y: dy } = offset(from, y);

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x,
        y: dy,
        scale: scale ? 0.96 : 1,
        filter: blur ? "blur(10px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.78, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its <RevealItem> children once the group scrolls in. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}
