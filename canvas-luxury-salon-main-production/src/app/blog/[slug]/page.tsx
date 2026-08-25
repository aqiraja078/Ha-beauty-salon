import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt || post.body.slice(0, 140),
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

  return (
    <ThemeScope scope="book">
      <article className="px-4 pb-12 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
            >
              ← Blog
            </Link>
            <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}{" "}
              · {site.name}
            </p>
          </Reveal>

          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-soft"
            />
          ) : null}

          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">
            {post.body}
          </div>

          {related.length > 0 ? (
            <div className="mt-14 border-t border-line pt-8">
              <p className="eyebrow">More posts</p>
              <ul className="mt-4 space-y-2">
                {related.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-sm font-medium text-ink hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </ThemeScope>
  );
}
