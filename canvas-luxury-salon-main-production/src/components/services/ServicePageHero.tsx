"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { canOptimizeImage } from "@/lib/image-host";
import { SERVICE_HERO_IMAGE } from "@/lib/service-card-images";

export type ServiceThemeId =
  | "hair"
  | "makeup"
  | "facial"
  | "bodySpa";

/** Admin-managed hero fields (Admin → Services → Page chrome). Blank values fall back to the built-in design copy. */
export type ServiceHeroContent = {
  label?: string;
  headline?: string;
  headlineAccent?: string;
  script?: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  theme: ServiceThemeId;
  title: string;
  description: string;
  hero?: ServiceHeroContent;
};

const HERO_COPY: Record<
  ServiceThemeId,
  {
    label: string;
    line1: string;
    line2: string;
    lead: string;
    accent: string;
    script: string;
  }
> = {
  hair: {
    label: "Hair · home service",
    line1: "Colour & Cut",
    line2: "At your door",
    lead:
      "From feather cuts to bridal buns and keratin — we work in your space across Jhelum, Dina, and Gujrat.",
    accent: "Length prices on colour and treatments.",
    script: "Your Crown, Our Care",
  },
  makeup: {
    label: "Look beautiful · feel confident",
    line1: "Event & Party",
    line2: "Makeup",
    lead:
      "From festive gatherings to mehndi nights and Nikkah ceremonies — we create stunning, long-lasting looks tailored to your style.",
    accent: "Camera-ready finish for every celebration.",
    script: "Because You Deserve to Shine",
  },
  facial: {
    label: "Facial · home service",
    line1: "Calm skin",
    line2: "For event week",
    lead:
      "Cleanup, glow, and bridal facials timed so your face settles before the photographer arrives.",
    accent: "Tell us if skin is sensitive — we adjust.",
    script: "Glow That Speaks for You",
  },
  bodySpa: {
    label: "Wax & body · home service",
    line1: "Smooth prep",
    line2: "Before the functions",
    lead:
      "Face-to-toe waxing, bridal packages, and polish care scheduled around mehndi and barat.",
    accent: "Leave a few days for skin to settle.",
    script: "Smooth, Soft & Radiant",
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

function ServiceLuxuryHero({
  theme,
  title,
  description,
  hero,
  reduce,
}: {
  theme: ServiceThemeId;
  title: string;
  description: string;
  hero?: ServiceHeroContent;
  reduce: boolean | null;
}) {
  const base = HERO_COPY[theme];
  const copy = {
    ...base,
    label: hero?.label?.trim() || base.label,
    line1: hero?.headline?.trim() || base.line1,
    line2: hero?.headlineAccent?.trim() || base.line2,
    script: hero?.script?.trim() || base.script,
  };
  const heroImage = hero?.image?.trim() || SERVICE_HERO_IMAGE[theme];
  const lead = description.trim() || copy.lead;

  return (
    <section className="relative isolate min-h-[min(62svh,500px)] sm:min-h-[min(66svh,600px)] overflow-hidden bg-canvas lg:min-h-[88vh]">
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/60 via-canvas/25 to-transparent lg:from-canvas lg:via-canvas/85 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas from-[12%] via-canvas/90 via-[52%] to-canvas/25 lg:from-canvas lg:via-transparent lg:to-canvas/40" />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <Image
          src={heroImage}
          alt={hero?.imageAlt ?? ""}
          fill
          unoptimized={!canOptimizeImage(heroImage)}
          priority
          className="object-cover object-[center_15%] lg:object-[center_20%]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-l from-transparent via-canvas/35 to-canvas/90 lg:block" />
      </div>

      {/* Mobile/tablet scrim — sits above the photo so text stays readable */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-canvas from-[18%] via-canvas/95 via-[54%] to-transparent to-[90%] sm:via-[72%] sm:to-[100%] lg:hidden"
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-canvas/85 via-canvas/55 to-transparent sm:block lg:hidden"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[min(62svh,500px)] sm:min-h-[min(66svh,600px)] max-w-7xl content-end items-end gap-8 px-4 pb-8 pt-[max(6.5rem,calc(env(safe-area-inset-top)+5.5rem))] sm:px-6 sm:pb-12 md:px-8 lg:min-h-[88vh] lg:grid-cols-2 lg:content-normal lg:items-center lg:gap-4 lg:pb-20 lg:pt-[max(5.5rem,calc(env(safe-area-inset-top)+4rem))]">
        <motion.div
          className="max-w-xl"
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
          }}
        >
          <motion.p
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-ink [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] sm:text-[11px] lg:text-ink-soft lg:[text-shadow:none]"
            variants={fadeUp}
          >
            <span className="h-px w-10 bg-accent/70" aria-hidden />
            {copy.label.replace(" · ", " • ").toUpperCase()}
          </motion.p>

          <motion.h1
            className="mt-3 font-display text-[2rem] leading-[1.08] text-accent [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] xs:text-[2.35rem] lg:[text-shadow:none] sm:mt-6 sm:text-[3.25rem] md:text-[3.75rem]"
            variants={fadeUp}
          >
            <span className="block">{copy.line1}</span>
            <span className="mt-1 block italic text-ink sm:mt-2">{copy.line2}</span>
          </motion.h1>

          <span className="sr-only">{title}</span>

          <motion.p
            className="mt-3 max-w-md text-[13px] leading-[1.65] text-ink [text-shadow:0_1px_10px_rgba(0,0,0,0.9)] sm:mt-7 sm:text-[1.02rem] sm:leading-[1.75] lg:text-ink-soft lg:[text-shadow:none]"
            variants={fadeUp}
          >
            {lead}
          </motion.p>

          <motion.div
            className="mt-5 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3"
            variants={fadeUp}
          >
            <Link href="/book" className="btn-primary min-h-[42px] px-6 text-[11px] sm:min-h-0 sm:px-7 sm:text-[length:inherit]">
              Book now →
            </Link>
            <Link href="/contact" className="btn-ghost min-h-[42px] px-6 text-[11px] sm:min-h-0 sm:px-7 sm:text-[length:inherit]">
              Contact
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none relative hidden min-h-[12rem] lg:block"
          initial={reduce ? false : { opacity: 0, x: 20 }}
          animate={reduce ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          <p className="absolute bottom-[18%] right-[6%] max-w-[14rem] text-center font-script text-[2.35rem] leading-snug text-accent xl:text-[2.75rem]">
            {copy.script}
            <span className="mt-2 block text-lg text-accent/80" aria-hidden>
              ♥
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function ServicePageHero({ theme, title, description, hero }: Props) {
  const reduce = useReducedMotion();

  return (
    <ServiceLuxuryHero
      theme={theme}
      title={title}
      description={description}
      hero={hero}
      reduce={reduce}
    />
  );
}
