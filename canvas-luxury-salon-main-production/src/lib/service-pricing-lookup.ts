import { bodySpaServiceSections } from "@/lib/body-spa-services-data";
import { facialServiceSections } from "@/lib/facial-services-data";
import { hairServiceSections } from "@/lib/hair-services-data";
import { makeupServiceSections } from "@/lib/makeup-services-data";
import { mehndiServiceSections } from "@/lib/mehndi-services-data";
import { nailsServiceSections } from "@/lib/nails-services-data";

/** Older / generic booking dropdown labels → display price hint */
const LEGACY_SERVICE_PRICES: Record<string, string> = {
  "Bridal Makeup": "From Rs. 25,000",
  "Party / Event Makeup": "From Rs. 8,500",
  "Hair Color & Styling": "From Rs. 12,000",
  "Facial Treatment": "From Rs. 3,000",
  "Body Waxing": "From Rs. 2,500",
  "Manicure & Pedicure": "From Rs. 3,500",
  "Laser Hair Removal": "Consult for quote",
  "Consultation / Trial": "Complimentary / from Rs. 2,000",
};

function buildPriceMap(): Map<string, string> {
  const m = new Map<string, string>();
  for (const [k, v] of Object.entries(LEGACY_SERVICE_PRICES)) {
    m.set(k, v);
  }
  for (const sec of makeupServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  for (const sec of facialServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  for (const sec of bodySpaServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  for (const sec of nailsServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  for (const sec of mehndiServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  for (const sec of hairServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, "See hair menu / consult");
    }
  }
  return m;
}

const priceMap = buildPriceMap();

export function lookupServicePriceLabel(service: string): string {
  const key = service.trim();
  return priceMap.get(key) ?? "See menu / consult";
}
