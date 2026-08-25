import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getJobBySlug } from "@/lib/jobs-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || !job.active) return { title: "Job" };
  return {
    title: job.title,
    description: job.description.slice(0, 140),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const [job, site] = await Promise.all([
    getJobBySlug(slug),
    getSiteContent(),
  ]);
  if (!job || !job.active) notFound();

  const waDigits = job.applyWhatsApp || site.phoneDigits;
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
    `Hi, I want to apply for: ${job.title}`
  )}`;
  const mailHref = job.applyEmail
    ? `mailto:${job.applyEmail}?subject=${encodeURIComponent(
        `Application: ${job.title}`
      )}`
    : null;

  return (
    <ThemeScope scope="book">
      <article className="px-4 pb-12 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/jobs"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
            >
              ← Jobs
            </Link>
            <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">
              {job.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {job.type}
              {job.location ? ` · ${job.location}` : ""}
              {job.salaryText ? ` · ${job.salaryText}` : ""}
            </p>
          </Reveal>

          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">
            {job.description}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={waHref} target="_blank" rel="noreferrer" className="btn-primary">
              Apply on WhatsApp
            </a>
            {mailHref ? (
              <a href={mailHref} className="btn-ghost">
                Apply by email
              </a>
            ) : (
              <Link href="/contact" className="btn-ghost">
                Contact
              </Link>
            )}
          </div>
        </div>
      </article>
    </ThemeScope>
  );
}
