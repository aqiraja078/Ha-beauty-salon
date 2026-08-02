"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import type { HomeContent } from "@/lib/cms-types";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  siteName: string;
  hero: HomeContent["hero"];
};

export function HomeHeroAnimated({ siteName, hero }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const container = useMemo(
    () => ({
      hidden: { opacity: reduce ? 1 : 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: reduce ? 0 : 0.11,
          delayChildren: reduce ? 0 : 0.12,
        },
      },
    }),
    [reduce]
  );

  const item = useMemo(
    () => ({
      hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 26 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.7, ease: easeOut },
      },
    }),
    [reduce]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-0 w-full overflow-hidden bg-canvas sm:min-h-[95vh]"
    >
      <motion.div
        className="absolute inset-0 h-[118%] w-full"
        style={reduce ? undefined : { y: imageY }}
      >
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover object-[center_32%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-canvas/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/35 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/[0.12] blur-3xl" />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-tint/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-0 max-w-7xl flex-col justify-center px-4 pb-8 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] xs:px-5 sm:min-h-[95vh] sm:px-6 sm:pb-16 sm:pt-[max(7rem,env(safe-area-inset-top))] md:px-8"
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-accent backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {siteName}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 max-w-4xl font-display text-[2.5rem] leading-[1.05] text-ink xs:text-5xl sm:text-6xl md:text-7xl"
          >
            {hero.headlineBefore}{" "}
            <span className="accent-gradient-text">{hero.headlineAccent}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-6 sm:text-base md:text-lg"
          >
            {hero.subcopy}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          >
            <Link href={hero.primaryCta.href} className="btn-primary w-full sm:w-auto">
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="btn-ghost w-full sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 hidden max-w-lg grid-cols-3 gap-4 border-t border-line pt-6 sm:mt-14 sm:grid sm:gap-6"
          >
            {hero.highlights.map((h) => (
              <div key={h.label}>
                <dt className="font-display text-2xl text-accent sm:text-3xl">
                  {h.value}
                </dt>
                <dd className="mt-1 text-[11px] leading-snug text-muted sm:text-xs">
                  {h.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </motion.div>

      {!reduce && (
        <motion.div
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted">
            Scroll
          </span>
          <span className="h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="block h-4 w-px bg-accent"
              animate={{ y: [-16, 40] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}
    </section>
  );
}
