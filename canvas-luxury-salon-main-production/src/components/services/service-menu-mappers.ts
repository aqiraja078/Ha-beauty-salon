import type { BodySpaServiceSection } from "@/lib/body-spa-services-data";
import type { FacialServiceSection } from "@/lib/facial-services-data";
import type { HairServiceSection } from "@/lib/hair-services-data";
import type { MakeupServiceSection } from "@/lib/makeup-services-data";
import type { MehndiServiceSection } from "@/lib/mehndi-services-data";
import type { NailsServiceSection } from "@/lib/nails-services-data";

export type ServiceMenuItem = {
  name: string;
  price: string;
  blurb: string;
  meta?: string;
};

export type ServiceMenuSection = {
  id: string;
  emoji: string;
  title: string;
  services: ServiceMenuItem[];
};

export function hairToMenu(sections: HairServiceSection[]): ServiceMenuSection[] {
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
