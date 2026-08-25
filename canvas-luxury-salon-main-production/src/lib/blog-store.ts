import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { BlogPost, BlogPostInput } from "@/lib/blog-types";
import { slugify, uniqueSlug } from "@/lib/content-slug";

const STORE_KEY = "salon-blog";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "blog.json");

function seedPosts(): BlogPost[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      title: "Bridal makeup tips for Jhelum weather",
      slug: "bridal-makeup-tips-jhelum",
      coverImage:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80",
      excerpt:
        "How to keep foundation fresh through heat, tears, and the dance floor.",
      body: "Barat halls in Jhelum can get warm fast. Start with a light primer, set with translucent powder, and pack blotting papers.\n\nAsk your artist for a touch-up kit — lipstick and compact go a long way between photos and mehndi night.",
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      title: "How to book a home beauty visit",
      slug: "how-to-book-home-beauty-visit",
      coverImage:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
      excerpt: "Pick a service, choose your area, and we confirm on WhatsApp.",
      body: "Open the Book page, select single or multi-service, choose Jhelum, Dina, or Gujrat, then pick a free slot.\n\nWe reply within 48 hours with confirmation and advance details if needed.",
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
    published: Boolean(input.published),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return data as BlogPost[];
      } catch {
        /* fall through */
      }
    }
    const local = await readLocal();
    if (local) return local;
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
