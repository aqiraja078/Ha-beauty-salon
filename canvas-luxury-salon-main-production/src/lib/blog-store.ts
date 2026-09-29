import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { BlogPost, BlogPostInput } from "@/lib/blog-types";
import { normalizeBlogTags } from "@/lib/blog-utils";
import { slugify, uniqueSlug } from "@/lib/content-slug";
import { rebrandLegacy } from "@/lib/legacy-brand";

const STORE_KEY = "salon-blog";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "blog.json");

function seedPosts(): BlogPost[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      title: "What is the Scope of Bridal Makeup in Jhelum, Dina & Gujrat?",
      slug: "scope-of-bridal-makeup-jhelum-dina-gujrat",
      coverImage:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&q=80",
      excerpt:
        "Explore how home bridal makeup is growing across Jhelum, Dina, and Gujrat — from barat and walima looks to mehndi nights, skin prep, and booking tips for 2026.",
      category: "Bridal",
      tags: [
        "BridalMakeup",
        "Barat",
        "Walima",
        "Jhelum",
        "HomeService",
        "AdaaBeautySalon",
      ],
      author: "Adaa Beauty Team",
      body: `Home bridal beauty across Punjab is growing fast. Families want camera-ready looks without travelling to a crowded salon — and artists who understand Pakistani bridal wear, humid halls, and long function days.

At Adaa Beauty Salon & Training Center we bring HD bridal makeup, hair, and facial prep to your door in Jhelum, Dina, and Gujrat.

## Why bridal makeup matters for shaadi week

Your barat and walima looks have to survive heat, tears, photos, and the dance floor. Soft glam that photographs well is more important than heavy cake foundation.

Strong bridal prep helps protect:

- Foundation that stays through long hours
- Dupatta and jewellery setting without last-minute stress
- Skin calm enough for close-up photos
- A touch-up plan between nikkah, mehndi, and barat

## Barat vs walima looks

Barat often calls for richer colour and bolder eyes. Walima leans softer, luminous, and elegant — with premium lashes and jewellery setting.

## How home bridal service works

- Share outfit, dupatta, and jewellery photos when you book
- We schedule around your function timeline
- Artists arrive with sanitised kits
- Menu prices stay clear before you confirm

## Skin prep before the big day

Book a glow or bridal facial a few days before events so skin looks fresh, not irritated. Hydration and gentle polish photograph better than last-minute heavy masks.

## Conclusion

Bridal makeup scope in our cities is expanding because families want reliable home service with honest timing and camera-ready finishing. Plan early, share references, and we will craft a look that lasts through every function.`,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      title: "How to Book a Home Beauty Visit with Adaa",
      slug: "how-to-book-home-beauty-visit",
      coverImage:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80",
      excerpt:
        "A clear step-by-step guide to booking makeup, facial, wax, nails, or mehndi at home in Jhelum, Dina, and Gujrat.",
      category: "Guides",
      tags: ["Booking", "HomeService", "WhatsApp", "Jhelum"],
      author: "Adaa Beauty Team",
      body: `Booking a home beauty visit should feel simple. Here is how to lock your slot with Adaa Beauty Salon & Training Center.

## Step 1 — Open the Book page

Go to Book on the website and choose a single service or a multi-service visit for the same day.

## Step 2 — Pick your area

Select Jhelum, Dina, or Gujrat so we plan travel time correctly.

## Step 3 — Choose date and time

Pick an open slot between 9 AM and 8 PM. Blocked dates will not appear.

## Step 4 — Share details

Add your phone, notes about skin sensitivity, and outfit photos if it is bridal or party makeup.

## Step 5 — Confirm on WhatsApp

We reply within 48 hours with confirmation and advance details if needed.

## Tips for a smooth visit

- Clear a well-lit seating space
- Keep jewellery and dupatta ready
- Mention allergies in the booking notes

Home service means salon-quality finishing without the drive — just book early for peak wedding weeks.`,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      title: "Bridal Makeup Tips for Jhelum Weather",
      slug: "bridal-makeup-tips-jhelum",
      coverImage:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1400&q=80",
      excerpt:
        "Keep foundation fresh through heat, tears, and the dance floor with practical tips for Punjab wedding halls.",
      category: "Tips",
      tags: ["BridalMakeup", "Weather", "HDMakeup", "TouchUp"],
      author: "Adaa Beauty Team",
      body: `Barat halls in Jhelum can get warm fast. The right prep keeps your look camera-ready from nikkah to the last dance.

## Start with skin, not product

Clean, hydrated skin holds makeup longer. Avoid trying a brand-new facial the morning of your event.

## Build a heat-proof base

- Light primer suited to your skin type
- HD foundation set with translucent powder
- Cream blush that melts into the skin
- Setting spray for humid rooms

## Eyes and lips that last

Waterproof mascara and a lip liner under your lipstick survive tears and photos. Pack a matching lipstick in your touch-up kit.

## Plan your touch-ups

Ask your artist for a mini kit — blotting papers, compact, and lipstick go a long way between photos and mehndi night.

## Conclusion

Jhelum weather is manageable when your artist plans for it. Book early, share your venue photos, and we will finish a look built for real wedding hours.`,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<BlogPost[] | null> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as BlogPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

async function writeLocal(list: BlogPost[]) {
  await ensureDataDir();
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function getBlobStore() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

function cleanInput(input: BlogPostInput) {
  const title = input.title.trim().slice(0, 160);
  return {
    title,
    slug: (input.slug ?? "").trim().slice(0, 80),
    coverImage: (input.coverImage ?? "").trim().slice(0, 500) || undefined,
    excerpt: (input.excerpt ?? "").trim().slice(0, 400) || undefined,
    body: (input.body ?? "").trim().slice(0, 20000),
    category: (input.category ?? "").trim().slice(0, 40) || undefined,
    tags: normalizeBlogTags(input.tags),
    author: (input.author ?? "").trim().slice(0, 80) || undefined,
    published: Boolean(input.published),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return rebrandLegacy(data as BlogPost[]);
      } catch {
        /* fall through */
      }
    }
    const local = await readLocal();
    if (local) return rebrandLegacy(local);
    const seeded = seedPosts();
    await writeLocal(seeded);
    return seeded;
  } catch {
    return seedPosts();
  }
}

async function savePosts(list: BlogPost[]) {
  const store = await getBlobStore();
  if (store) {
    try {
      await store.set(STORE_KEY, JSON.stringify(list));
      return;
    } catch {
      /* fall through */
    }
  }
  await writeLocal(list);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const list = await getBlogPosts();
  return list
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const list = await getBlogPosts();
  return list.find((p) => p.slug === slug) ?? null;
}

export async function addBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getBlogPosts();
  const slug = uniqueSlug(
    cleaned.slug || cleaned.title,
    list.map((p) => p.slug)
  );
  const now = new Date().toISOString();
  const post: BlogPost = {
    id: randomUUID(),
    title: cleaned.title,
    slug,
    coverImage: cleaned.coverImage,
    excerpt: cleaned.excerpt,
    body: cleaned.body,
    category: cleaned.category,
    tags: cleaned.tags.length ? cleaned.tags : undefined,
    author: cleaned.author,
    published: cleaned.published,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(post);
  await savePosts(list);
  return post;
}

export async function updateBlogPost(
  id: string,
  input: BlogPostInput
): Promise<BlogPost | null> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getBlogPosts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const slug = uniqueSlug(
    cleaned.slug || cleaned.title || list[idx].slug,
    list.filter((p) => p.id !== id).map((p) => p.slug)
  );

  const next: BlogPost = {
    ...list[idx],
    title: cleaned.title,
    slug,
    coverImage: cleaned.coverImage,
    excerpt: cleaned.excerpt,
    body: cleaned.body,
    category: cleaned.category,
    tags: cleaned.tags.length ? cleaned.tags : undefined,
    author: cleaned.author,
    published: cleaned.published,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  await savePosts(list);
  return next;
}

export async function deleteBlogPost(id: string): Promise<BlogPost | null> {
  const list = await getBlogPosts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await savePosts(list);
  return removed;
}

export { slugify };
