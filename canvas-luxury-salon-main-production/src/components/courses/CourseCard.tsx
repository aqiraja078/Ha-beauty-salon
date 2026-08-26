import Link from "next/link";
import type { Course } from "@/lib/courses-types";

type Props = {
  course: Course;
};

function splitTitle(title: string): { lead: string; accent: string } {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.*?)(\s+course)$/i);
  if (match && match[1].trim()) {
    return { lead: match[1].trim(), accent: match[2].trim() };
  }
  return { lead: trimmed, accent: "Course" };
}

function featureLabel(course: Course): string {
  if (course.level) {
    const l = course.level.toLowerCase();
    if (l.includes("beginner")) return "Beginner-friendly · Certificate";
    if (l.includes("inter")) return "Hands-on practice · Certificate";
    if (l.includes("adv")) return "Advanced skills · Certificate";
  }
  return "Certificate included";
}

export function CourseCard({ course }: Props) {
  const { lead, accent } = splitTitle(course.title);
  const feature = featureLabel(course);
  const meta = [course.duration, course.level].filter(Boolean).join(" · ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift-lg sm:p-6">
      {/* Soft decorative wash — theme accent, not purple */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/[0.07]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-24 right-0 h-40 w-40 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgb(var(--accent)) 1.2px, transparent 1.2px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        className="pointer-events-none absolute right-4 top-20 h-28 w-28 rounded-full border border-accent/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-10 top-28 h-16 w-16 rounded-full border border-accent/10"
        aria-hidden
      />

      <div className="relative z-[1] flex flex-1 flex-col">
        {meta ? (
          <p className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[11px] font-medium text-accent">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <rect x="3.2" y="5" width="17.6" height="16" rx="3" />
              <path d="M3.2 9.8h17.6M8 3v4M16 3v4" />
            </svg>
            <span className="truncate">{meta}</span>
          </p>
        ) : null}

        <h2 className="mt-4 font-display text-[1.65rem] leading-[1.15] text-ink sm:text-[1.85rem]">
          {lead}{" "}
          <span className="text-accent">{accent}</span>
        </h2>

        <div
          className="mt-3 h-px w-16 bg-gradient-to-r from-accent via-accent/50 to-transparent"
          aria-hidden
        />

        <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-soft">
          {course.description}
        </p>

        {course.price ? (
          <p className="mt-5 font-display text-2xl tracking-tight text-accent sm:text-[1.75rem]">
            {course.price}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-accent-soft/80 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-accent shadow-soft">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden
            >
              <path d="M12 3.5 4.5 7v4.2c0 4.4 3.2 8.3 7.5 9.3 4.3-1 7.5-4.9 7.5-9.3V7Z" />
              <path d="m9.2 12 1.9 1.9 3.7-3.8" />
            </svg>
          </span>
          <p className="min-w-0 flex-1 text-xs font-medium text-accent">
            {feature}
          </p>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-strong text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-fg shadow-lift transition duration-300 hover:brightness-105 hover:shadow-lift-lg active:scale-[0.98]"
        >
          View &amp; apply →
        </Link>
      </div>
    </article>
  );
}
