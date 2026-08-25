import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getPublishedBlogPosts } from "@/lib/blog-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Blog",
    description: `Beauty tips and updates from ${site.name}.`,
  };
}

export default async function BlogPage() {
  const [posts, site] = await Promise.all([
    getPublishedBlogPosts(),
    getSiteContent(),
  ]);

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:text-6xl">
              Beauty <span className="accent-gradient-text">blog</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Tips, booking guides, and salon news for Jhelum, Dina, and Gujrat.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-8 sm:px-6 sm:py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-ink-soft">
              No posts yet — check back soon.
            </p>
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <RevealItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift-lg"
                  >
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt=""
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="aspect-[16/10] w-full bg-accent-soft" />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-xl text-ink group-hover:text-accent">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <p className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                        Read more
                      </p>
                    </div>
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
