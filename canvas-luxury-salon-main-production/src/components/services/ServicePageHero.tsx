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
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-canvas">
      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/92 to-canvas/55 lg:via-canvas/85 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/40" />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <Image
          src={heroImage}
          alt={hero?.imageAlt ?? ""}
          fill
          unoptimized={!canOptimizeImage(heroImage)}
          priority
          className="object-cover object-[center_20%] opacity-90 lg:opacity-100"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-canvas/20 to-canvas lg:via-canvas/35 lg:to-canvas/90" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4rem))] sm:px-6 md:px-8 lg:min-h-[88vh] lg:grid-cols-2 lg:gap-4 lg:pb-20">
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
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-ink-soft sm:text-[11px]"
            variants={fadeUp}
          >
            <span className="h-px w-10 bg-accent/70" aria-hidden />
            {copy.label.replace(" · ", " • ").toUpperCase()}
          </motion.p>

          <motion.h1
            className="mt-5 font-display text-[2.35rem] leading-[1.08] text-accent xs:text-5xl sm:mt-6 sm:text-[3.25rem] md:text-[3.75rem]"
            variants={fadeUp}
          >
            <span className="block">{copy.line1}</span>
            <span className="mt-1 block italic text-ink sm:mt-2">{copy.line2}</span>
          </motion.h1>

          <span className="sr-only">{title}</span>

          <motion.p
            className="mt-5 max-w-md text-sm leading-[1.75] text-ink-soft sm:mt-7 sm:text-[1.02rem]"
            variants={fadeUp}
          >
            {lead}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            variants={fadeUp}
          >
            <Link href="/book" className="btn-primary px-7">
              Book now →
            </Link>
            <Link href="/contact" className="btn-ghost px-7">
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
