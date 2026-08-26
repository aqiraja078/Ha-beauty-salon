"use client";

import { useState } from "react";
import {
  CourseEnrollModal,
  type CourseEnrollTarget,
} from "@/components/courses/CourseEnrollModal";

type Props = {
  slug: string;
  title: string;
  price?: string;
  level?: string;
  duration?: string;
};

export function CourseDetailEnroll({
  slug,
  title,
  price,
  level,
  duration,
}: Props) {
  const [open, setOpen] = useState(false);
  const target: CourseEnrollTarget = { slug, title, price };
  const meta = [level, duration, price].filter(Boolean).join(" · ");

  return (
    <>
      <div className="mt-10 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Join this course
        </p>
        <p className="mt-2 font-display text-xl text-ink sm:text-2xl">
          {title}
        </p>
        {meta ? (
          <p className="mt-1 text-sm text-muted">{meta}</p>
        ) : null}
        {price ? (
          <p className="mt-3 text-base font-semibold text-accent">{price}</p>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary mt-5 flex min-h-12 w-full items-center justify-center sm:w-auto sm:px-8"
        >
          Fill enrollment form
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          One submit saves your details and course price for the salon admin,
          and opens WhatsApp to confirm.
        </p>
      </div>

      <CourseEnrollModal
        course={open ? target : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
