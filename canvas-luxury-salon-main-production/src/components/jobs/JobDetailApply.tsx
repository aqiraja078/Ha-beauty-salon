"use client";

import { useState } from "react";
import {
  JobApplyModal,
  type JobApplyTarget,
} from "@/components/jobs/JobApplyModal";

type Props = {
  slug: string;
  title: string;
  type: string;
  location?: string;
  mailHref?: string | null;
  variant: "mobile" | "sidebar";
};

export function JobDetailApply({
  slug,
  title,
  type,
  location,
  mailHref,
  variant,
}: Props) {
  const [open, setOpen] = useState(false);
  const target: JobApplyTarget = { slug, title };

  return (
    <>
      {variant === "mobile" ? (
        <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-primary"
          >
            Apply now
          </button>
          {mailHref ? (
            <a href={mailHref} className="btn-ghost">
              Email CV
            </a>
          ) : null}
        </div>
      ) : (
        <div className="sticky top-28 rounded-2xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Apply for this role
          </p>
          <p className="mt-2 font-display text-xl text-ink">{title}</p>
          <p className="mt-1 text-xs text-muted">
            {type}
            {location ? ` · ${location}` : ""}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 flex min-h-11 w-full items-center justify-center rounded-full bg-accent text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-fg"
          >
            Fill apply form
          </button>
          {mailHref ? (
            <a
              href={mailHref}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-full border border-line text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Email CV
            </a>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">
            One submit saves to admin and opens WhatsApp with your details.
          </p>
        </div>
      )}

      <JobApplyModal
        job={open ? target : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
