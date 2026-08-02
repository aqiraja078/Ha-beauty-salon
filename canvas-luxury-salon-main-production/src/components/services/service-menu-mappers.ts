import type { BodySpaServiceSection } from "@/lib/body-spa-services-data";
import type { CmsMenuSection } from "@/lib/cms-types";
import type { FacialServiceSection } from "@/lib/facial-services-data";
import type { HairServiceSection } from "@/lib/hair-services-data";
import {
  deriveLengthPrices,
  HAIR_LENGTH_SECTION_IDS,
  type HairLengthPrices,
} from "@/lib/hair-length-pricing";
import type { MakeupServiceSection } from "@/lib/makeup-services-data";
import type { MehndiServiceSection } from "@/lib/mehndi-services-data";
import type { NailsServiceSection } from "@/lib/nails-services-data";

export type ServiceMenuItem = {
  name: string;
  price: string;
  blurb: string;
  meta?: string;
  lengthPrices?: HairLengthPrices;
};

export type ServiceMenuSection = {
  id: string;
  emoji: string;
  title: string;
  services: ServiceMenuItem[];
};

function maybeLengthPrices(
  sectionId: string,
  price: string,
  existing?: HairLengthPrices
): HairLengthPrices | undefined {
  if (existing) return existing;
  if (!HAIR_LENGTH_SECTION_IDS.has(sectionId)) return undefined;
  return deriveLengthPrices(price);
}

/** CMS menu → shared ServiceCategoryPage shape. */
export function cmsToMenu(sections: CmsMenuSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.items.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.blurb,
      meta: i.duration,
      lengthPrices: maybeLengthPrices(s.id, i.price, i.lengthPrices),
    })),
  }));
}

export function hairToMenu(sections: HairServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.hint,
      lengthPrices: maybeLengthPrices(s.id, i.price),
    })),
  }));
}

export function makeupToMenu(sections: MakeupServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.hint,
    })),
  }));
}

export function facialToMenu(sections: FacialServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.description,
      meta: i.duration,
    })),
  }));
}

export function bodySpaToMenu(sections: BodySpaServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.description,
      meta: i.duration,
    })),
  }));
}

export function nailsToMenu(sections: NailsServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.description,
      meta: i.duration,
    })),
  }));
}

export function mehndiToMenu(sections: MehndiServiceSection[]): ServiceMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    services: s.services.map((i) => ({
      name: i.name,
      price: i.price,
      blurb: i.description,
      meta: i.duration,
    })),
  }));
}
