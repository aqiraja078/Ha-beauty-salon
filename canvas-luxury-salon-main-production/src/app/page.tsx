import { HomePageSections } from "@/components/home/HomeSections";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getHomeContent, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [home, site] = await Promise.all([
    getHomeContent(),
    getSiteContent(),
  ]);

  return (
    <ThemeScope scope="home">
      <HomePageSections home={home} siteName={site.name} />
    </ThemeScope>
  );
}
