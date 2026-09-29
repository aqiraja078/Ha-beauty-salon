"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const isDev = process.env.NODE_ENV === "development";

export function PageLoader({ siteName }: { siteName: string }) {
  const [done, setDone] = useState(isDev);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (isDev) return;
    const t = window.setTimeout(() => setDone(true), reduce ? 0 : 700);
    return () => window.clearTimeout(t);
  }, [reduce]);

  if (isDev || reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-7 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/25 bg-accent-soft"
            >
              <span className="font-display text-lg font-semibold text-accent">
                Adaa
              </span>
            </motion.div>

            <motion.p
              className="text-center font-display text-lg tracking-[0.18em] text-ink md:text-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
            >
              {siteName}
            </motion.p>

            <motion.div
              className="h-[3px] w-32 overflow-hidden rounded-full bg-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent to-tint"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
