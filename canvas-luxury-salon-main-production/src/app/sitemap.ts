import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/lib/public-site-url";

const base = getPublicSiteOrigin().replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services/hair",
    "/services/makeup",
    "/services/facial",
    "/services/body-spa",
    "/contact",
    "/book",
    "/sales",
    "/blog",
    "/courses",
    "/jobs",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
