import type { Metadata } from "next";
import Link from "next/link";
import { BlogHeroMedia } from "@/components/blog/BlogHeroMedia";
import { BlogStoryRow } from "@/components/blog/BlogStoryRow";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getPublishedBlogPosts } from "@/lib/blog-store";
import { blogReadingMinutes, formatBlogDate } from "@/lib/blog-utils";
import { getHomeContent, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Journal",
    description: `Beauty notes and bridal stories from ${site.name}.`,
  };
}

export default async function BlogPage() {
  const [posts, site, home] = await Promise.all([
    getPublishedBlogPosts(),
    getSiteContent(),
    getHomeContent(),
  ]);
  const blog = home.blog;

  const latest = posts[0];
  const heroImage = blog.image;
  const ampIdx = site.name.indexOf("&");
  const titleTop = ampIdx > 0 ? site.name.slice(0, ampIdx).trim() : site.name;
  const titleBottom = ampIdx > 0 ? site.name.slice(ampIdx).trim() : "";

  return (
    <ThemeScope scope="blog">
      {/* ── Hero ── */}
      <section className="relative min-h-[460px] overflow-hidden border-b border-line/60 sm:min-h-[480px]">
        <BlogHeroMedia src={heroImage} />

        {/* Left: bokeh glow + fine-line gold leaves */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[52%] bg-[radial-gradient(circle_at_18%_30%,rgb(var(--accent)/0.14),transparent_9%),radial-gradient(circle_at_42%_78%,rgb(var(--accent)/0.12),transparent_7%),radial-gradient(circle_at_30%_55%,rgb(var(--accent)/0.08),transparent_12%),radial-gradient(circle_at_8%_85%,rgb(var(--accent)/0.12),transparent_8%)]"
          aria-hidden
        />
        <svg
          viewBox="0 0 260 200"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute -left-6 bottom-0 z-[1] w-44 -scale-x-100 text-accent opacity-40 sm:-left-2 sm:w-64 md:w-72"
        >
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M250 196 C210 150 170 110 120 60" />
            <path d="M215 160 C190 150 176 128 178 104 C204 112 218 134 215 160Z" />
            <path d="M186 126 C160 122 144 102 144 80 C168 84 184 102 186 126Z" />
            <path d="M150 88 C128 88 112 72 110 50 C132 52 148 68 150 88Z" />
            <path d="M232 178 C246 152 232 128 208 118" />
            <path d="M240 186 C236 156 250 130 246 104 C226 118 220 152 240 186Z" />
            <path d="M120 60 C118 40 128 22 144 12" />
          </g>
        </svg>

        <div className="relative z-10 mx-auto flex min-h-[460px] max-w-6xl flex-col justify-center px-4 pb-8 pt-[max(6.6rem,calc(env(safe-area-inset-top)+5.5rem))] sm:min-h-[480px] sm:px-6 md:px-10">
          <Reveal blur className="max-w-2xl">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-accent sm:text-[11px]">
              <span className="h-px w-8 bg-accent/70 sm:w-12" aria-hidden />
              {blog.eyebrow}
              <span className="h-px w-8 bg-accent/70 sm:w-12" aria-hidden />
            </p>

            <h1 className="mt-4 font-display text-[clamp(1.9rem,4.8vw,3.5rem)] leading-[1.06] tracking-[-0.01em] sm:mt-6">
              <span className="accent-gradient-text">{titleTop}</span>
              {titleBottom ? (
                <>
                  <br />
                  <span className="text-ink">{titleBottom}</span>
                </>
              ) : null}
              <span className="sr-only"> — Blog</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink sm:mt-5 sm:text-[0.95rem]">
              {blog.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
              {latest ? (
                <Link href={`/blog/${latest.slug}`} className="btn-primary gap-2 px-7">
                  Read latest
                  <span aria-hidden>→</span>
                </Link>
              ) : null}
              <a href="#notes" className="btn-ghost border-accent/80 px-7 text-white hover:border-accent">
                Browse
              </a>
            </div>
          </Reveal>

          <div className="mt-auto flex items-center gap-4 pt-8 sm:pt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft sm:text-[11px]">
              {posts.length} {posts.length === 1 ? "note" : "notes"}
            </p>
            <span className="h-px w-16 bg-accent/60 sm:w-24" aria-hidden />
          </div>
        </div>
      </section>

      {/* ── Stories ── */}
      <section id="notes" className="scroll-mt-16 bg-canvas sm:scroll-mt-20">
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
              Makeup, facial, or wax — booked for your doorstep
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
