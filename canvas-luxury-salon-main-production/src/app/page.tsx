import { HomePageSections } from "@/components/home/HomeSections";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getHomeContent, getSiteContent } from "@/lib/content-store";
import { getPublishedGalleryItems } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [home, site, galleryAll] = await Promise.all([
    getHomeContent(),
    getSiteContent(),
    getPublishedGalleryItems(),
  ]);
  // Home shows just the first 6; everything else lives on /gallery.
  const galleryItems = galleryAll.slice(0, 6);

  return (
    <ThemeScope scope="home">
      <HomePageSections
        home={home}
        siteName={site.name}
        phoneDigits={site.phoneDigits}
        galleryItems={galleryItems}
      />
    </ThemeScope>
  );
}
