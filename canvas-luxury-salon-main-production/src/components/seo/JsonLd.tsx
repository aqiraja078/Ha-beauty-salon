import { getPublicSiteOrigin } from "@/lib/public-site-url";
import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description: site.description,
    url: getPublicSiteOrigin(),
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Jhelum, Dina, Gujrat",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
