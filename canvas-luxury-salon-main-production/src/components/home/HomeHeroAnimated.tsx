"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import type { HomeContent } from "@/lib/cms-types";
import { canOptimizeImage } from "@/lib/image-host";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  siteName: string;
  hero: HomeContent["hero"];
  whatsappHref: string;
};

export function HomeHeroAnimated({ siteName, hero, whatsappHref }: Props) {
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
          unoptimized={!canOptimizeImage(hero.image)}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover object-[center_32%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/88 to-canvas/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/50 to-canvas/15" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/[0.14] blur-3xl" />
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
            className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/20 bg-surface/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-accent backdrop-blur-sm max-[359px]:text-[8px] max-[359px]:tracking-[0.06em] xs:gap-2 xs:px-3.5 xs:text-[10px] xs:tracking-[0.16em] sm:px-4 sm:tracking-[0.28em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
            className="mt-6 flex flex-row items-center gap-2 sm:mt-10 sm:gap-3"
          >
            <Link
              href={hero.primaryCta.href}
              className="btn-primary min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-5 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
            >
              {hero.primaryCta.label}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost inline-flex min-w-0 flex-1 items-center justify-center gap-2 px-3 text-[10px] tracking-[0.12em] xs:px-5 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-current"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
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
