import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getActiveJobs } from "@/lib/jobs-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Jobs",
    description: `Careers at ${site.name} — join our home beauty team.`,
  };
}

export default async function JobsPage() {
  const [jobs, site] = await Promise.all([getActiveJobs(), getSiteContent()]);

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:text-6xl">
              Join our <span className="accent-gradient-text">team</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Open roles for artists and assistants across Jhelum, Dina, and
              Gujrat.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-8 sm:px-6 sm:py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          {jobs.length === 0 ? (
            <p className="text-center text-sm text-ink-soft">
              No open roles right now — send your CV via{" "}
              <Link href="/contact" className="text-accent hover:underline">
                Contact
              </Link>
              .
            </p>
          ) : (
            <RevealGroup className="space-y-4">
              {jobs.map((job) => (
                <RevealItem key={job.id}>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="block rounded-3xl border border-line bg-surface p-5 shadow-soft transition hover:border-accent/35 hover:shadow-lift sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl text-ink">
                          {job.title}
                        </h2>
                        <p className="mt-1.5 text-xs text-muted">
                          {job.type}
                          {job.location ? ` · ${job.location}` : ""}
                          {job.salaryText ? ` · ${job.salaryText}` : ""}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                        View role
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
                      {job.description}
                    </p>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </ThemeScope>
  );
}
