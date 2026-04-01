import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/lib/public-site-url";

const base = getPublicSiteOrigin().replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
