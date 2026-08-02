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
    "/services/nails",
    "/services/mehndi",
    "/contact",
    "/book",
    "/offers",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
