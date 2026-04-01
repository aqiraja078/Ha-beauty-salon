"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { site } from "@/lib/site";

const heroImage =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HomeHeroAnimated() {
  const reduce = useReducedMotion();

  const container = useMemo(
    () => ({
      hidden: { opacity: reduce ? 1 : 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: reduce ? 0 : 0.12,
          delayChildren: reduce ? 0 : 0.15,
        },
      },
    }),
    [reduce]
  );

  const item = useMemo(
    () => ({
      hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 28 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.65, ease: easeOut },
      },
    }),
    [reduce]
  );

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden sm:min-h-[75vh] md:min-h-screen">
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={false}
        animate={reduce ? { scale: 1 } : { scale: [1, 1.02, 1] }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 28, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Image
          src={heroImage}
          alt="Luxury salon atmosphere"
          fill
          priority
          className="object-cover object-[center_35%] sm:object-[center_32%] md:object-[center_28%]"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(201,169,98,0.12),transparent)]" />

      <div className="relative z-10 mx-auto grid h-full max-w-7xl place-content-end px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[max(6.5rem,env(safe-area-inset-top))] xs:px-5 sm:px-6 md:px-8 md:pb-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-full"
        >
          <motion.p
            variants={item}
            className="text-[10px] uppercase tracking-[0.35em] text-gold-light xs:text-xs xs:tracking-[0.45em]"
          >
            {site.tagline}
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-3 max-w-4xl font-display text-3xl leading-[1.08] text-white xs:text-5xl sm:mt-4 sm:text-5xl md:text-6xl"
          >
            Discover Your Radiance
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base md:text-lg"
          >
            An elevated beauty ritual — precision hair, luminous skin, and artistry
            that feels unmistakably you.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/book"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-black shadow-sm transition hover:opacity-95 sm:w-auto sm:px-8"
              >
                Book appointment
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/services"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.07] px-6 text-[11px] font-medium uppercase tracking-[0.22em] text-white/95 backdrop-blur-md transition hover:border-gold/40 hover:bg-white/12 sm:w-auto sm:px-8"
              >
                Explore services
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
