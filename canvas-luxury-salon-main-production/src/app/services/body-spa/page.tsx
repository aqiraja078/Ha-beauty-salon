import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { bodySpaToMenu } from "@/components/services/service-menu-mappers";
import { bodySpaServiceSections } from "@/lib/body-spa-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Body & spa",
  description: `Massage, body treatments, hammam, and bridal spa by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/736x/81/6d/df/816ddf871f37612426c401d39c55d22f.jpg?w=800&q=70",
  "https://i.pinimg.com/1200x/95/55/e0/9555e062724cc2ca83f0cb3e6b38c586.jpg?w=800&q=70",
];

export default function BodySpaServicesPage() {
  return (
    <ServiceCategoryPage
      theme="bodySpa"
      heroImages={heroImages}
      heroAlt="Body spa and massage at Huma Salon & Studio"
      kicker="Body & spa menu"
      title="Body & spa"
      description="Massage, rituals, hammam-style care, and bridal packages — duration and price listed for easy booking on your phone."
      quickLinks={[
        { href: "/services/hair", label: "Hair" },
        { href: "/services/facial", label: "Facial" },
        { href: "/services/nails", label: "Nails" },
        { href: "/services/makeup", label: "Makeup" },
      ]}
      sections={bodySpaToMenu(bodySpaServiceSections)}
      footerNote="Planning a bridal spa day or gift package? Start with a consultation so we can tailor timing and add-ons."
    />
  );
}
