import type { Metadata } from "next";
import Link from "next/link";
import { JobsBoard } from "@/components/jobs/JobsBoard";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getSiteContent } from "@/lib/content-store";
import { getActiveJobs } from "@/lib/jobs-store";
import { site as siteDefaults } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Careers",
    description: `Careers at ${site.name} — join our home beauty team in Jhelum, Dina & Gujrat.`,
  };
}

export default async function JobsPage() {
  const [jobs, site] = await Promise.all([getActiveJobs(), getSiteContent()]);
  const waGeneral = `https://wa.me/${site.phoneDigits || siteDefaults.phoneDigits}?text=${encodeURIComponent(
    `Hi ${site.name}, I want to join your team.`
  )}`;

  return (
    <ThemeScope scope="jobs">
      <section
        id="open-roles"
        className="bg-canvas px-4 pb-12 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-20 sm:pt-[max(7rem,env(safe-area-inset-top))] md:px-8"
      >
        <div className="mx-auto max-w-5xl">
          {jobs.length === 0 ? (
            <div className="rounded-[1.35rem] border border-line bg-surface px-5 py-14 text-center shadow-soft">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                Join our team
              </span>
              <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
                Open Positions
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
                No open roles right now — send your CV and we&apos;ll reach out
                when a seat opens.
              </p>
              <a
                href={waGeneral}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6 inline-flex"
              >
                Message us
              </a>
            </div>
          ) : (
            <JobsBoard jobs={jobs} />
          )}
        </div>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-10 sm:px-6 sm:py-14 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 rounded-[1.35rem] border border-line bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:p-7">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Don&apos;t see your role?
            </p>
            <h2 className="mt-1.5 font-display text-xl text-ink sm:text-2xl">
              Introduce yourself anyway
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Tell us your skills, city, and availability — we keep CVs for the
              next hiring round.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <a
              href={waGeneral}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-fg"
            >
              WhatsApp HR
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent/35 px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent"
            >
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </ThemeScope>
  );
}
