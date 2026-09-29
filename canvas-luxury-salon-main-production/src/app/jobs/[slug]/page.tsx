import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobDetailApply } from "@/components/jobs/JobDetailApply";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getActiveJobs, getJobBySlug } from "@/lib/jobs-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || !job.active) return { title: "Role" };
  return {
    title: `${job.title} — Careers`,
    description: job.description.slice(0, 140),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const [job, others] = await Promise.all([
    getJobBySlug(slug),
    getActiveJobs(),
  ]);
  if (!job || !job.active) notFound();

  const mailHref = job.applyEmail
    ? `mailto:${job.applyEmail}?subject=${encodeURIComponent(
        `Application: ${job.title}`
      )}`
    : null;
  const related = others.filter((j) => j.id !== job.id).slice(0, 3);
  const applyProps = {
    slug: job.slug,
    title: job.title,
    type: job.type,
    location: job.location,
    mailHref,
  };

  return (
    <ThemeScope scope="jobs">
      <article className="px-4 pb-12 pt-[max(5rem,calc(env(safe-area-inset-top)+3.25rem))] sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
          <div>
            <Reveal>
              <Link
                href="/jobs"
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
              >
                ← All careers
              </Link>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                  {job.type}
                </span>
                {job.location ? (
                  <span className="rounded-full bg-canvas-alt px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {job.location}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
                {job.title}
              </h1>
              {job.salaryText ? (
                <p className="mt-3 text-sm text-muted">
                  Compensation: {job.salaryText}
                </p>
              ) : null}
            </Reveal>

            <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">
              {job.description}
            </div>

            <JobDetailApply {...applyProps} variant="mobile" />

            {related.length > 0 ? (
              <div className="mt-14 border-t border-line pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Other openings
                </p>
                <ul className="mt-4 space-y-3">
                  {related.map((j) => (
                    <li key={j.id}>
                      <Link
                        href={`/jobs/${j.slug}`}
                        className="font-display text-lg text-ink hover:text-accent"
                      >
                        {j.title}
                      </Link>
                      <p className="text-xs text-muted">
                        {j.type}
                        {j.location ? ` · ${j.location}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <JobDetailApply {...applyProps} variant="sidebar" />
          </aside>
        </div>
      </article>
    </ThemeScope>
  );
}
