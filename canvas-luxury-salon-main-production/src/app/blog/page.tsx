import type { Metadata } from "next";
import Link from "next/link";
import { BlogHeroMedia } from "@/components/blog/BlogHeroMedia";
import { BlogStoryRow } from "@/components/blog/BlogStoryRow";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getPublishedBlogPosts } from "@/lib/blog-store";
import { blogReadingMinutes, formatBlogDate } from "@/lib/blog-utils";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1800&q=85";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Journal",
    description: `Beauty notes and bridal stories from ${site.name}.`,
  };
}

export default async function BlogPage() {
  const [posts, site] = await Promise.all([
    getPublishedBlogPosts(),
    getSiteContent(),
  ]);

  const latest = posts[0];
  const heroImage = latest?.coverImage || FALLBACK_HERO;

  return (
    <ThemeScope scope="blog">
      {/* ── Hero: compact on mobile ── */}
      <section className="relative min-h-[42vh] overflow-hidden xs:min-h-[48vh] sm:min-h-[56vh]">
        <BlogHeroMedia src={heroImage} />

        <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 pb-7 pt-[max(4.75rem,calc(env(safe-area-inset-top)+3rem))] xs:min-h-[48vh] xs:pb-8 sm:min-h-[56vh] sm:px-6 sm:pb-12 md:px-10 md:pb-14">
          <Reveal blur>
            <p className="font-display text-[clamp(1.85rem,9vw,4.75rem)] leading-[0.92] tracking-[-0.02em] text-white">
              {site.name}
            </p>

            <div className="mt-3 max-w-lg sm:mt-5">
              <h1 className="font-display text-2xl italic leading-tight text-white/95 sm:text-[2.25rem]">
                Journal
              </h1>
              <p className="mt-2 max-w-[20rem] text-[13px] leading-relaxed text-white/75 sm:max-w-none sm:text-sm">
                Bridal looks, home tips, and notes for Jhelum, Dina & Gujrat.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                {latest ? (
                  <Link
                    href={`/blog/${latest.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-accent-soft sm:min-h-11 sm:px-6 sm:text-[11px]"
                  >
                    Read latest
                  </Link>
                ) : null}
                <a
                  href="#notes"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/35 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white/10 sm:min-h-11 sm:px-6 sm:text-[11px]"
                >
                  Browse
                </a>
              </div>
            </div>
          </Reveal>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/20 pt-3 sm:mt-8 sm:pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px]">
              {posts.length} {posts.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stories ── */}
      <section id="notes" className="scroll-mt-16 bg-canvas sm:scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 md:px-10">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent sm:text-[11px]">
              The collection
            </p>
            <h2 className="mt-1.5 font-display text-2xl text-ink sm:mt-2 sm:text-4xl md:text-5xl">
              Notes worth keeping
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-soft sm:mt-3 sm:text-sm">
              Open any story — written for real wedding weeks and everyday glow.
            </p>
          </Reveal>
        </div>

        {posts.length === 0 ? (
          <div className="border-t border-line px-4 py-20 text-center">
            <p className="font-display text-2xl italic text-ink-soft">
              The journal is quiet today.
            </p>
            <p className="mt-2 text-sm text-muted">New notes will land here soon.</p>
          </div>
        ) : (
          <div className="border-t border-line">
            {posts.map((post, i) => (
              <BlogStoryRow
                key={post.id}
                reverse={i % 2 === 1}
                post={{
                  href: `/blog/${post.slug}`,
                  title: post.title,
                  excerpt: post.excerpt,
                  category: post.category,
                  date: formatBlogDate(post.createdAt),
                  mins: blogReadingMinutes(post.body),
                  image: post.coverImage,
                  index: i + 1,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Closing CTA: one job ── */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgb(var(--accent)/0.18),transparent_60%),linear-gradient(180deg,rgb(var(--canvas-2)),rgb(var(--canvas)))]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 text-center sm:px-6 sm:py-20 md:py-24">
          <Reveal blur>
            <p className="font-display text-xl leading-snug text-ink sm:text-[clamp(1.85rem,4vw,2.75rem)] sm:leading-tight">
              Your story starts
              <span className="italic text-accent"> at home</span>
            </p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-ink-soft sm:mt-4 sm:max-w-md sm:text-sm">
              Makeup, facial, wax, nails, or mehndi — booked for your doorstep
              in Jhelum, Dina & Gujrat.
            </p>
            <Link
              href="/book"
              className="btn-primary mt-4 inline-flex min-h-10 px-6 text-[10px] sm:mt-8 sm:min-h-12 sm:px-9 sm:text-[11px]"
            >
              Book a visit
            </Link>
          </Reveal>
        </div>
      </section>
    </ThemeScope>
  );
}
