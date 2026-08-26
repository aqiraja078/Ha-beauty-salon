import { bodySpaServiceSections } from "@/lib/body-spa-services-data";
import { facialServiceSections } from "@/lib/facial-services-data";
import { hairServiceSections } from "@/lib/hair-services-data";
import { makeupServiceSections } from "@/lib/makeup-services-data";

/** Older / generic booking dropdown labels → display price hint */
const LEGACY_SERVICE_PRICES: Record<string, string> = {
  "Bridal Makeup": "From Rs. 25,000",
  "Party / Event Makeup": "From Rs. 8,500",
  "Hair Color & Styling": "From Rs. 12,000",
  "Facial Treatment": "From Rs. 3,000",
  "Body Waxing": "From Rs. 2,500",
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
  for (const sec of hairServiceSections) {
    for (const s of sec.services) {
      m.set(s.name, s.price);
    }
  }
  return m;
}

const PRICE_MAP = buildPriceMap();

export function lookupServicePriceLabel(service: string): string {
  return PRICE_MAP.get(service.trim()) ?? "See menu / consult";
}

export function allKnownServicePrices(): Record<string, string> {
  return Object.fromEntries(PRICE_MAP.entries());
}
