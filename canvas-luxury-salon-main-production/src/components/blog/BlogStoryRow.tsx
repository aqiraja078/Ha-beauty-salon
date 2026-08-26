"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type PostLink = {
  href: string;
  title: string;
  excerpt?: string;
  category?: string;
  date: string;
  mins: number;
  image?: string;
  index: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Same side-by-side journal row on mobile and desktop. */
export function BlogStoryRow({
  post,
  reverse,
}: {
  post: PostLink;
  reverse?: boolean;
}) {
  const reduce = useReducedMotion();
  const n = String(post.index).padStart(2, "0");

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease }}
      className="border-b border-line/70"
    >
      <Link
        href={post.href}
        className={`group mx-auto flex max-w-6xl items-stretch gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 md:gap-8 md:px-10 ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        {/* Stretches to text height — same on all screens */}
        <div className="relative w-[30%] max-w-[9.5rem] shrink-0 self-stretch sm:w-[28%] sm:max-w-[11rem] md:max-w-[12.5rem]">
          <div className="relative h-full min-h-[6.5rem] overflow-hidden rounded-2xl border border-line bg-canvas-alt shadow-soft ring-1 ring-ink/[0.04]">
            {post.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-strong" />
            )}
          </div>
          <span
            className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface font-display text-xs text-gilt shadow-soft ring-1 ring-line"
            aria-hidden
          >
            {n}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[11px] sm:tracking-[0.18em]">
            {post.category || "Note"}
            <span className="mx-1.5 text-line">·</span>
            {post.date}
            <span className="mx-1.5 text-line">·</span>
            {post.mins} min
          </p>

          <h2 className="mt-1.5 font-display text-lg leading-snug text-ink transition group-hover:text-accent sm:mt-2 sm:text-xl md:text-[1.4rem]">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft sm:mt-2 sm:text-sm sm:max-w-xl">
              {post.excerpt}
            </p>
          ) : null}

          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent sm:mt-3 sm:text-[11px]">
            Read
            <span
              className="inline-block transition duration-300 group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
