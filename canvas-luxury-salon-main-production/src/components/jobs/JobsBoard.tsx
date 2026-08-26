"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  JobApplyModal,
  type JobApplyTarget,
} from "@/components/jobs/JobApplyModal";
import type { JobPost } from "@/lib/jobs-types";

type Props = {
  jobs: JobPost[];
};

function roleKind(title: string): "makeup" | "assistant" | "general" {
  const t = title.toLowerCase();
  if (t.includes("makeup") || t.includes("make-up") || t.includes("artist")) {
    return "makeup";
  }
  if (t.includes("assistant") || t.includes("helper")) return "assistant";
  return "general";
}

function RoleIcon({ kind }: { kind: ReturnType<typeof roleKind> }) {
  if (kind === "makeup") {
    return (
      <svg viewBox="0 0 64 64" className="h-10 w-10 text-accent" aria-hidden>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M28 12c0 8 4 14 10 18" />
          <path d="M38 30l8 18c1 2-1 4-3 3l-16-7" />
          <path d="M22 44c6 2 12 2 18 0" />
          <circle cx="24" cy="48" r="3" fill="currentColor" stroke="none" />
          <path d="M18 20h8M20 16v8" />
        </g>
      </svg>
    );
  }
  if (kind === "assistant") {
    return (
      <svg viewBox="0 0 64 64" className="h-10 w-10 text-accent" aria-hidden>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 40c0-8 6-14 12-14s12 6 12 14" />
          <path d="M18 48h28" />
          <path d="M32 18v8M28 22h8" />
          <path d="M40 28c6 2 10 8 10 14" />
          <path d="M24 28c-4 4-6 10-6 16" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 text-accent" aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="16" y="22" width="32" height="24" rx="3" />
        <path d="M24 22v-4a8 8 0 0 1 16 0v4" />
        <path d="M16 34h32" />
      </g>
    </svg>
  );
}

function highlightsFor(job: JobPost): string[] {
  const out: string[] = [];
  const d = `${job.title} ${job.description}`.toLowerCase();
  if (d.includes("kit")) out.push("Own kit preferred");
  if (d.includes("flex") || d.includes("weekend") || d.includes("hour")) {
    out.push("Flexible timing");
  }
  if (d.includes("whatsapp") || d.includes("communication")) {
    out.push("WhatsApp communication");
  }
  if (d.includes("bridal")) out.push("Bridal experience");
  if (d.includes("travel") || d.includes("home")) out.push("Home visits");
  if (out.length === 0) {
    out.push(job.type, job.location ? "Multi-city" : "Salon team");
    if (job.salaryText) out.push(job.salaryText);
  }
  return out.slice(0, 3);
}

function HighlightIcon({ i }: { i: number }) {
  const common =
    "h-3.5 w-3.5 shrink-0 text-accent";
  if (i === 0) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <rect x="4" y="7" width="16" height="13" rx="2" />
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function JobsBoard({ jobs }: Props) {
  const [applyJob, setApplyJob] = useState<JobApplyTarget | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ha-saved-jobs");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      if (parsed && typeof parsed === "object") setSaved(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ha-saved-jobs", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const cards = useMemo(
    () =>
      jobs.map((job) => ({
        job,
        kind: roleKind(job.title),
        highlights: highlightsFor(job),
      })),
    [jobs]
  );

  return (
    <div>
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="8" r="3" />
            <path d="M3 19c0-3 2.5-5 6-5" />
            <path d="M16 11h4M18 9v4" />
            <path d="M14 19c0-2.5 1.5-4 4-4" />
          </svg>
          Join our team
        </span>
        <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl md:text-[2.75rem]">
          Open Positions
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
          Become a part of our talented team and help us create beauty and
          confidence every day.
        </p>
        <div className="mt-5 flex justify-center text-accent/70" aria-hidden>
          <svg viewBox="0 0 48 24" className="h-6 w-12">
            <path
              d="M24 2c-2 6-8 8-10 14 4-2 8-2 10 2 2-4 6-4 10-2-2-6-8-8-10-14Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </header>

      <ul className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
        {cards.map(({ job, kind, highlights }) => (
          <li key={job.id}>
            <article className="relative overflow-hidden rounded-[1.35rem] border border-line bg-surface p-4 shadow-soft sm:p-5 md:p-6">
              {/* soft leaf wash */}
              <div
                className="pointer-events-none absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-accent/[0.06] blur-2xl"
                aria-hidden
              />

              <button
                type="button"
                aria-label={saved[job.id] ? "Unsave role" : "Save role"}
                onClick={() =>
                  setSaved((s) => ({ ...s, [job.id]: !s[job.id] }))
                }
                className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition sm:right-4 sm:top-4 ${
                  saved[job.id]
                    ? "bg-accent text-accent-fg"
                    : "bg-accent-soft text-accent hover:bg-accent hover:text-accent-fg"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M12 3.5 9.5 9H4l4.5 3.3L6.8 18 12 14.6 17.2 18l-1.7-5.7L20 9h-5.5L12 3.5Z" />
                </svg>
              </button>

              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-soft sm:h-[4.5rem] sm:w-[4.5rem]">
                  <RoleIcon kind={kind} />
                </div>

                <div className="min-w-0 flex-1 pr-8 md:pr-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                      {job.type}
                    </span>
                    {job.location ? (
                      <span className="rounded-full bg-[#f0ebe3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                        {job.location}
                      </span>
                    ) : null}
                    {job.salaryText ? (
                      <span className="rounded-full bg-[#f0ebe3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                        {job.salaryText}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-2.5 font-display text-xl leading-snug text-ink sm:text-2xl">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="transition hover:text-accent"
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {job.description}
                  </p>

                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {highlights.map((h, i) => (
                      <li
                        key={h}
                        className="inline-flex items-center gap-1.5 text-[11px] text-ink-soft"
                      >
                        <HighlightIcon i={i} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[11.5rem]">
                  <button
                    type="button"
                    onClick={() =>
                      setApplyJob({ slug: job.slug, title: job.title })
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-fg transition hover:opacity-95"
                  >
                    Apply now
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                      →
                    </span>
                  </button>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent/35 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent transition hover:bg-accent-soft"
                  >
                    View role details
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <JobApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
    </div>
  );
}
