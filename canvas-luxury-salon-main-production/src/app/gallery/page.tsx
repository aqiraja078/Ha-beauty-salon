import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getHomeContent, getSiteContent } from "@/lib/content-store";
import { getPublishedGalleryItems } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [site, home] = await Promise.all([getSiteContent(), getHomeContent()]);
  return {
    title: "Gallery",
    description: `${home.galleryPage.lead} — ${site.name}.`,
  };
}

export default async function GalleryPage() {
  const [items, home] = await Promise.all([
    getPublishedGalleryItems(),
    getHomeContent(),
  ]);
  const page = home.galleryPage;

  return (
    <ThemeScope scope="gallery">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-12 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              <span className="accent-gradient-text">{page.title}</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              {page.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-8 sm:px-6 sm:py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          {items.length > 0 ? (
            <GalleryGrid items={items} />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface px-6 py-12 text-center">
              <p className="font-display text-xl text-accent">Gallery coming soon</p>
              <p className="mt-2 text-sm text-ink-soft">
                We are adding photos and videos of our latest work.
              </p>
              <Link href="/book" className="btn-primary mt-6 inline-flex px-7">
                Book now →
              </Link>
            </div>
          )}
        </div>
      </section>
    </ThemeScope>
  );
}
