import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog-store";
import { blogReadingMinutes, formatBlogDate } from "@/lib/blog-utils";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return { title: "Note" };
  return {
    title: post.title,
    description: post.excerpt || post.body.slice(0, 140),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, site, others] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteContent(),
    getPublishedBlogPosts(),
  ]);
  if (!post || !post.published) notFound();

  const related = others.filter((p) => p.id !== post.id).slice(0, 3);
  const mins = blogReadingMinutes(post.body);
  const author = post.author?.trim() || site.name;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const shareUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <ThemeScope scope="blog">
      <article>
        {/* Compact framed cover */}
        <header className="px-4 pb-2 pt-[max(5rem,calc(env(safe-area-inset-top)+3.25rem))] sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex text-[11px] font-semibold uppercase tracking-[0.22em] text-accent transition hover:opacity-80"
              >
                ← Journal
              </Link>
            </Reveal>

            <Reveal>
              <p className="mt-5 font-display text-xl text-ink sm:text-2xl">
                {site.name}
              </p>
              <h1 className="mt-3 font-display text-[clamp(1.75rem,4.5vw,2.85rem)] leading-[1.12] text-ink text-balance">
                {post.title}
              </h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span className="text-ink-soft">{author}</span>
                <span aria-hidden>·</span>
                <time dateTime={post.createdAt}>
                  {formatBlogDate(post.createdAt)}
                </time>
                <span aria-hidden>·</span>
                <span>{mins} min</span>
                {post.category ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{post.category}</span>
                  </>
                ) : null}
              </p>
            </Reveal>

            {post.coverImage ? (
              <div className="mt-7 overflow-hidden rounded-2xl border border-line shadow-soft ring-1 ring-ink/5 sm:mt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt=""
                  className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className="px-4 py-8 sm:px-6 sm:py-12 md:px-8">
          <div className="mx-auto max-w-[42rem]">
            {post.excerpt ? (
              <p className="font-display text-xl leading-snug text-ink sm:text-2xl sm:leading-snug">
                <span className="text-gilt">“</span>
                {post.excerpt}
                <span className="text-gilt">”</span>
              </p>
            ) : null}

            {post.tags && post.tags.length > 0 ? (
              <p className="mt-6 text-sm tracking-wide text-muted">
                {post.tags.map((t, i) => (
                  <span key={t}>
                    {i > 0 ? (
                      <span className="mx-2 text-line" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span className="text-ink-soft">{t}</span>
                  </span>
                ))}
              </p>
            ) : null}

            <div
              className={`hairline mt-8 h-px w-full ${post.excerpt ? "" : "mt-0"}`}
              aria-hidden
            />

            <div className="mt-10">
              <BlogArticleBody body={post.body} />
            </div>

            <div className="mt-14 border-t border-line pt-8">
              <BlogShareBar title={post.title} url={shareUrl} />
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Written for you by
                </p>
                <p className="mt-1 font-display text-xl text-ink">{author}</p>
              </div>
              <Link
                href="/book"
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
              >
                Book with us →
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="border-t border-line bg-canvas-alt px-4 py-14 sm:px-6 sm:py-20 md:px-8">
            <div className="mx-auto max-w-6xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Keep turning the page
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                More from the journal
              </h2>
              <ul className="mt-10 space-y-0 divide-y divide-line border-y border-line">
                {related.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-baseline gap-5 py-6 sm:gap-8 sm:py-8"
                    >
                      <span className="font-display text-2xl text-gilt transition group-hover:text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-xl leading-snug text-ink transition group-hover:text-accent sm:text-2xl">
                        {p.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
              >
                ← Back to journal
              </Link>
            </div>
          </section>
        ) : null}
      </article>
    </ThemeScope>
  );
}
