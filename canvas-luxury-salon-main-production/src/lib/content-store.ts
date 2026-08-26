import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import {
  defaultHomeContent,
  defaultServiceMenus,
  defaultSiteContent,
} from "@/lib/cms-defaults";
import type {
  HomeContent,
  ServiceCategorySlug,
  ServiceMenus,
  SiteContent,
} from "@/lib/cms-types";
import { SERVICE_CATEGORY_SLUGS } from "@/lib/cms-types";

const SITE_KEY = "site";
const HOME_KEY = "home";
const SERVICES_KEY = "services";

const DATA_DIR = path.resolve(process.cwd(), "data");
const SITE_FILE = path.join(DATA_DIR, "cms-site.json");
const HOME_FILE = path.join(DATA_DIR, "cms-home.json");
const SERVICES_FILE = path.join(DATA_DIR, "cms-services.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function getCmsStore() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

async function readLocalJson<T>(file: string): Promise<T | null> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeLocalJson(file: string, data: unknown) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

async function readKey<T>(key: string, file: string): Promise<T | null> {
  try {
    const store = await getCmsStore();
    if (store) {
      try {
        const data = await store.get(key, { type: "json" });
        if (data) return data as T;
      } catch (err) {
        console.error(`[cms] blob read ${key} failed, using local:`, err);
      }
    }
    return await readLocalJson<T>(file);
  } catch (err) {
    console.error(`[cms] read ${key} failed:`, err);
    return null;
  }
}

async function writeKey(key: string, file: string, data: unknown) {
  const store = await getCmsStore();
  if (store) {
    try {
      await store.set(key, JSON.stringify(data));
      return;
    } catch (err) {
      console.error(`[cms] blob write ${key} failed, using local:`, err);
    }
  }
  await writeLocalJson(file, data);
}

function mergeSite(raw: Partial<SiteContent> | null): SiteContent {
  if (!raw || typeof raw !== "object") return structuredClone(defaultSiteContent);
  return {
    ...defaultSiteContent,
    ...raw,
    social: { ...defaultSiteContent.social, ...(raw.social ?? {}) },
  };
}

function mergeHome(raw: Partial<HomeContent> | null): HomeContent {
  if (!raw || typeof raw !== "object") return structuredClone(defaultHomeContent);
  const d = defaultHomeContent;
  return {
    ...d,
    ...raw,
    hero: { ...d.hero, ...(raw.hero ?? {}) },
    makeupSection: {
      ...d.makeupSection,
      ...(raw.makeupSection ?? {}),
      cards: raw.makeupSection?.cards ?? d.makeupSection.cards,
    },
    servicesSection: {
      ...d.servicesSection,
      ...(raw.servicesSection ?? {}),
      categories: (
        raw.servicesSection?.categories ?? d.servicesSection.categories
      ).filter((c) =>
        (SERVICE_CATEGORY_SLUGS as string[]).includes(c.slug)
      ),
    },
    about: { ...d.about, ...(raw.about ?? {}) },
    why: {
      ...d.why,
      ...(raw.why ?? {}),
      reasons: raw.why?.reasons ?? d.why.reasons,
    },
    steps: {
      ...d.steps,
      ...(raw.steps ?? {}),
      items: raw.steps?.items ?? d.steps.items,
    },
    gallery: {
      ...d.gallery,
      ...(raw.gallery ?? {}),
      images: raw.gallery?.images ?? d.gallery.images,
    },
    offers: {
      ...d.offers,
      ...(raw.offers ?? {}),
      items: (raw.offers?.items ?? d.offers.items).map((item) => ({
        id: item.id,
        badge: item.badge,
        title: item.title,
        titleAccent: item.titleAccent,
        body: item.body,
        ctaLabel: item.ctaLabel,
        ctaHref: item.ctaHref,
        includes: item.includes ?? [],
        price: item.price ?? "Price on consult",
      })),
    },
    testimonials: {
      ...d.testimonials,
      ...(raw.testimonials ?? {}),
      items: raw.testimonials?.items ?? d.testimonials.items,
    },
    cta: {
      ...d.cta,
      ...(raw.cta ?? {}),
      trustPoints: raw.cta?.trustPoints ?? d.cta.trustPoints,
      proof: raw.cta?.proof ?? d.cta.proof,
      primaryCta: { ...d.cta.primaryCta, ...(raw.cta?.primaryCta ?? {}) },
      secondaryCta: {
        ...d.cta.secondaryCta,
        ...(raw.cta?.secondaryCta ?? {}),
      },
    },
  };
}

function mergeServices(raw: Partial<ServiceMenus> | null): ServiceMenus {
  const base = structuredClone(defaultServiceMenus);
  if (!raw || typeof raw !== "object") return base;
  for (const slug of SERVICE_CATEGORY_SLUGS) {
    if (raw[slug]) {
      base[slug] = {
        ...base[slug],
        ...raw[slug],
        sections: raw[slug]!.sections ?? base[slug].sections,
        heroImages: raw[slug]!.heroImages ?? base[slug].heroImages,
      };
    }
  }
  return base;
}

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readKey<Partial<SiteContent>>(SITE_KEY, SITE_FILE);
  return mergeSite(raw);
}

export async function getHomeContent(): Promise<HomeContent> {
  const raw = await readKey<Partial<HomeContent>>(HOME_KEY, HOME_FILE);
  return mergeHome(raw);
}

export async function getServiceMenus(): Promise<ServiceMenus> {
  const raw = await readKey<Partial<ServiceMenus>>(SERVICES_KEY, SERVICES_FILE);
  return mergeServices(raw);
}

export async function getServiceCategory(slug: ServiceCategorySlug) {
  const menus = await getServiceMenus();
  return menus[slug];
}

export async function saveSiteContent(data: SiteContent): Promise<SiteContent> {
  const next = mergeSite(data);
  await writeKey(SITE_KEY, SITE_FILE, next);
  return next;
}

export async function saveHomeContent(data: HomeContent): Promise<HomeContent> {
  const next = mergeHome(data);
  await writeKey(HOME_KEY, HOME_FILE, next);
  return next;
}

export async function saveServiceMenus(
  data: ServiceMenus
): Promise<ServiceMenus> {
  const next = mergeServices(data);
  await writeKey(SERVICES_KEY, SERVICES_FILE, next);
  return next;
}

export async function saveServiceCategory(
  slug: ServiceCategorySlug,
  data: ServiceMenus[ServiceCategorySlug]
): Promise<ServiceMenus> {
  const menus = await getServiceMenus();
  menus[slug] = data;
  return saveServiceMenus(menus);
}

/** All bookable service names from CMS menus + home makeup cards + legacy labels. */
export async function getBookingServiceNames(): Promise<string[]> {
  const [menus, home] = await Promise.all([
    getServiceMenus(),
    getHomeContent(),
  ]);
  const names = new Set<string>();
  for (const slug of SERVICE_CATEGORY_SLUGS) {
    for (const sec of menus[slug].sections) {
      for (const item of sec.items) names.add(item.name);
    }
  }
  for (const card of home.makeupSection.cards) names.add(card.name);
  for (const legacy of [
    "Bridal Makeup",
    "Party / Event Makeup",
    "Hair Color & Styling",
    "Facial Treatment",
    "Body Waxing",
    "Laser Hair Removal",
    "Consultation / Trial",
  ]) {
    names.add(legacy);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export async function lookupCmsServicePrice(
  service: string
): Promise<string> {
  const map = await getBookingServicePriceMap();
  return map[service.trim()] ?? "See menu / consult";
}

/** Name → menu price for the booking form dropdown. */
export async function getBookingServicePriceMap(): Promise<
  Record<string, string>
> {
  const [menus, home] = await Promise.all([
    getServiceMenus(),
    getHomeContent(),
  ]);
  const map: Record<string, string> = {
    "Bridal Makeup": "From Rs. 25,000",
    "Party / Event Makeup": "From Rs. 8,500",
    "Hair Color & Styling": "From Rs. 12,000",
    "Facial Treatment": "From Rs. 3,000",
    "Body Waxing": "From Rs. 2,500",
    "Manicure & Pedicure": "From Rs. 3,500",
    "Laser Hair Removal": "Consult for quote",
    "Consultation / Trial": "Complimentary / from Rs. 2,000",
  };
  for (const slug of SERVICE_CATEGORY_SLUGS) {
    for (const sec of menus[slug].sections) {
      for (const item of sec.items) {
        map[item.name] = item.price;
      }
    }
  }
  for (const card of home.makeupSection.cards) {
    map[card.name] = card.price;
  }
  return map;
}
