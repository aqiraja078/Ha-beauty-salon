"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type ServiceThemeId =
  | "hair"
  | "makeup"
  | "facial"
  | "bodySpa"
  | "nails"
  | "mehndi";

type Props = {
  theme: ServiceThemeId;
  title: string;
  description: string;
};

const HERO_COPY: Record<
  ServiceThemeId,
  {
    label: string;
    line1: string;
    line2: string;
    lead: string;
    accent: string;
  }
> = {
  hair: {
    label: "Hair · home service",
    line1: "Colour & cut",
    line2: "At your door",
    lead:
      "From feather cuts to bridal buns and keratin — we work in your space across Jhelum, Dina, and Gujrat.",
    accent: "Length prices on colour and treatments.",
  },
  makeup: {
    label: "Makeup · home service",
    line1: "Barat to walima",
    line2: "Camera ready",
    lead:
      "Looks built for dupatta, jewellery, and long functions — not a one-style-fits-all kit.",
    accent: "Trials available before the big day.",
  },
  facial: {
    label: "Facial · home service",
    line1: "Calm skin",
    line2: "For event week",
    lead:
      "Cleanup, glow, and bridal facials timed so your face settles before the photographer arrives.",
    accent: "Tell us if skin is sensitive — we adjust.",
  },
  bodySpa: {
    label: "Wax & body · home service",
    line1: "Smooth prep",
    line2: "Before the functions",
    lead:
      "Face-to-toe waxing, bridal packages, and polish care scheduled around mehndi and barat.",
    accent: "Leave a few days for skin to settle.",
  },
  nails: {
    label: "Nails · home service",
    line1: "Hands & feet",
    line2: "Event finished",
    lead:
      "Gel, art, and bridal sets colour-matched to your outfit — done at home with tidy cleanup.",
    accent: "Group bookings welcome for bridal parties.",
  },
  mehndi: {
    label: "Mehndi · home service",
    line1: "Henna that",
    line2: "Holds the night",
    lead:
      "Bridal, Arabic, and Eid patterns for hands and feet — paced for guests and deep stain.",
    accent: "Book early for heavy bridal sets.",
  },
};

function LotusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 44" fill="none" aria-hidden>
      <path
        d="M28 40c1.2-7.5 5.8-12.8 12-16.2C35.5 18 31.8 10.5 28 2.5 24.2 10.5 20.5 18 16 23.8 22.2 27.2 26.8 32.5 28 40Z"
        fill="currentColor"
        opacity="0.88"
      />
      <path
        d="M28 40c-.8-6.2-4.2-11-9.2-14.5C14.2 22 9.5 15.5 6.5 8c5.2 4.8 10.2 11.5 13.5 18.2C22.5 31.5 26.2 36 28 40Z"
        fill="currentColor"
        opacity="0.48"
      />
      <path
        d="M28 40c.8-6.2 4.2-11 9.2-14.5C41.8 22 46.5 15.5 49.5 8c-5.2 4.8-10.2 11.5-13.5 18.2C33.5 31.5 29.8 36 28 40Z"
        fill="currentColor"
        opacity="0.48"
      />
      <path
        d="M28 38c-1.2-4.5-5-8-10-10 4-.2 7.5-2.2 10-5.5 2.5 3.3 6 5.3 10 5.5-5 2-8.8 5.5-10 10Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

function Sparkle({
  className,
  delay = 0,
  reduce,
}: {
  className?: string;
  delay?: number;
  reduce: boolean | null;
}) {
  return (
    <motion.span
      className={`pointer-events-none absolute text-gilt ${className ?? ""}`}
      aria-hidden
      animate={
        reduce
          ? { opacity: 0.45 }
          : { opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.1, 0.85] }
      }
      transition={
        reduce
          ? undefined
          : { duration: 3.6, repeat: Infinity, delay, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
        <path d="M12 1.5 13.6 9.2 21 12l-7.4 2.8L12 22.5l-1.6-7.7L3 12l7.4-2.8L12 1.5Z" />
      </svg>
    </motion.span>
  );
}

function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute grid grid-cols-3 gap-2 opacity-30 ${className ?? ""}`}
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="h-[3px] w-[3px] rounded-full bg-muted" />
      ))}
    </div>
  );
}

/** Soft organic edge waves — fade into centre, no hard side panels. */
function SideWaves({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-0 ${
        flip ? "right-0" : "left-0"
      } w-[48%] max-w-lg sm:w-[42%] lg:w-[38%]`}
      aria-hidden
    >
      <svg
        viewBox="0 0 420 900"
        className={`h-full w-full ${flip ? "-scale-x-100" : ""}`}
        preserveAspectRatio="xMinYMid slice"
      >
        <defs>
          <linearGradient
            id={`hero-wave-a-${side}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0.3"
          >
            <stop offset="0%" stopColor="rgb(var(--tint-soft))" stopOpacity="0.95" />
            <stop offset="70%" stopColor="rgb(var(--tint))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(var(--canvas))" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`hero-wave-b-${side}`}
            x1="0"
            y1="0.2"
            x2="1"
            y2="0.8"
          >
            <stop offset="0%" stopColor="rgb(var(--tint))" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(var(--tint))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer soft bloom */}
        <path
          d="M0 0C95 70 150 160 130 270c-22 120 40 180 95 260 58 85 40 170 10 250-20 55-8 120 25 180H0V0Z"
          fill={`url(#hero-wave-a-${side})`}
        />
        {/* Inner ribbon */}
        <path
          d="M0 80C70 130 110 200 95 290c-18 110 35 165 80 235 48 75 30 155 5 230-15 48-5 105 18 155H0V80Z"
          fill={`url(#hero-wave-b-${side})`}
        />
        {/* Gold silk lines */}
        <path
          d="M55 60c55 90 70 190 40 290s-20 180 45 270 55 160 25 240"
          stroke="rgb(var(--gilt) / 0.38)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M110 30c48 95 58 195 30 295s10 185 50 275 42 155 18 230"
          stroke="rgb(var(--gilt) / 0.2)"
          strokeWidth="0.9"
          fill="none"
        />
        <path
          d="M165 110c38 70 45 160 20 235s15 150 40 220"
          stroke="rgb(var(--accent) / 0.12)"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function ServicePageHero({ theme, title }: Props) {
  const reduce = useReducedMotion();
  const copy = HERO_COPY[theme];

  return (
    <section className="relative isolate overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 42%, rgb(var(--surface) / 0.97) 0%, rgb(var(--canvas) / 0.75) 48%, transparent 72%)",
        }}
      />

      <SideWaves side="left" />
      <SideWaves side="right" />

      <DotGrid className="bottom-[16%] left-[7%] z-[1] hidden md:grid" />
      <DotGrid className="right-[8%] top-[15%] z-[1] hidden md:grid" />

      <Sparkle
        className="left-[12%] top-[24%] z-[1] h-3 w-3"
        delay={0}
        reduce={reduce}
      />
      <Sparkle
        className="right-[14%] top-[28%] z-[1] h-2.5 w-2.5"
        delay={0.7}
        reduce={reduce}
      />
      <Sparkle
        className="bottom-[30%] left-[20%] z-[1] hidden h-2 w-2 sm:block"
        delay={1.2}
        reduce={reduce}
      />
      <Sparkle
        className="bottom-[32%] right-[18%] z-[1] h-3 w-3"
        delay={1.8}
        reduce={reduce}
      />

      <div className="relative z-10 mx-auto flex min-h-0 max-w-2xl flex-col items-center justify-center px-4 pb-8 pt-[max(5rem,calc(env(safe-area-inset-top)+3.5rem))] text-center sm:min-h-[68vh] sm:max-w-3xl sm:px-8 sm:pb-16 md:min-h-[72vh] md:max-w-4xl">
        <motion.div
          className="flex w-full flex-col items-center"
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
          }}
        >
          <motion.div variants={fadeUp}>
            <LotusIcon className="mx-auto h-9 w-11 text-accent sm:h-10 sm:w-12" />
          </motion.div>

          <motion.p
            className="mt-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gilt sm:mt-6 sm:text-[11px]"
            variants={fadeUp}
          >
            <span className="h-px w-8 bg-gilt/70 sm:w-12" aria-hidden />
            {copy.label}
            <span className="h-px w-8 bg-gilt/70 sm:w-12" aria-hidden />
          </motion.p>

          <motion.h1
            className="mt-4 font-display text-[2.4rem] leading-[1.05] tracking-tight text-ink xs:text-5xl sm:mt-6 sm:text-6xl md:text-[4.35rem]"
            variants={fadeUp}
          >
            <span className="block">{copy.line1}</span>
            <span className="mt-1 block italic text-accent sm:mt-2">
              {copy.line2}
            </span>
          </motion.h1>

          <span className="sr-only">{title}</span>

          <motion.p
            className="mx-auto mt-4 max-w-lg text-sm leading-[1.7] text-ink-soft sm:mt-7 sm:text-[1.05rem] sm:leading-[1.75]"
            variants={fadeUp}
          >
            {copy.lead}{" "}
            <span className="font-medium text-accent">{copy.accent}</span>
          </motion.p>

          <motion.div
            className="mt-6 flex w-full max-w-sm flex-row items-center justify-center gap-2 sm:mt-10 sm:max-w-none sm:gap-3"
            variants={fadeUp}
          >
            <Link
              href="/book"
              className="btn-primary min-w-0 flex-1 px-4 text-[10px] tracking-[0.14em] caret-transparent sm:w-auto sm:flex-none sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
            >
              Book now
            </Link>
            <Link
              href="/contact"
              className="btn-ghost min-w-0 flex-1 px-4 text-[10px] tracking-[0.14em] caret-transparent sm:w-auto sm:flex-none sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
            >
              Contact
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
