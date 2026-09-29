import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { Course, CourseInput } from "@/lib/courses-types";
import { uniqueSlug } from "@/lib/content-slug";
import { rebrandLegacy } from "@/lib/legacy-brand";

const STORE_KEY = "salon-courses";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "courses.json");

function seedCourses(): Course[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      title: "Bridal makeup basics",
      slug: "bridal-makeup-basics",
      coverImage:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a86108?w=1200&q=80",
      price: "From Rs. 25,000",
      duration: "3 days",
      level: "Beginner",
      description:
        "Learn base, eye looks, and finishing for nikkah and barat — practice kits included. Classes held in Jhelum with limited seats.",
      whatsappNote: "Ask about next Bridal makeup batch",
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      title: "Hair styling for occasions",
      slug: "hair-styling-occasions",
      coverImage:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
      price: "From Rs. 18,000",
      duration: "2 days",
      level: "Intermediate",
      description:
        "Updos, soft curls, and veil-friendly styles for mehndi and walima. Hands-on practice on models.",
      whatsappNote: "Hair styling course enquiry",
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<Course[] | null> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as Course[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

async function writeLocal(list: Course[]) {
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

function cleanInput(input: CourseInput) {
  const title = input.title.trim().slice(0, 160);
  return {
    title,
    slug: (input.slug ?? "").trim().slice(0, 80),
    coverImage: (input.coverImage ?? "").trim().slice(0, 500) || undefined,
    price: (input.price ?? "").trim().slice(0, 80) || undefined,
    duration: (input.duration ?? "").trim().slice(0, 80) || undefined,
    level: (input.level ?? "").trim().slice(0, 60) || undefined,
    description: (input.description ?? "").trim().slice(0, 8000),
    whatsappNote: (input.whatsappNote ?? "").trim().slice(0, 200) || undefined,
    published: Boolean(input.published),
  };
}

export async function getCourses(): Promise<Course[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return rebrandLegacy(data as Course[]);
      } catch {
        /* fall through */
      }
    }
    const local = await readLocal();
    if (local) return rebrandLegacy(local);
    const seeded = seedCourses();
    await writeLocal(seeded);
    return seeded;
  } catch {
    return seedCourses();
  }
}

async function saveCourses(list: Course[]) {
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

export async function getPublishedCourses(): Promise<Course[]> {
  const list = await getCourses();
  return list
    .filter((c) => c.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const list = await getCourses();
  return list.find((c) => c.slug === slug) ?? null;
}

export async function addCourse(input: CourseInput): Promise<Course> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getCourses();
  const slug = uniqueSlug(
    cleaned.slug || cleaned.title,
    list.map((c) => c.slug)
  );
  const now = new Date().toISOString();
  const course: Course = {
    id: randomUUID(),
    title: cleaned.title,
    slug,
    coverImage: cleaned.coverImage,
    price: cleaned.price,
    duration: cleaned.duration,
    level: cleaned.level,
    description: cleaned.description,
    whatsappNote: cleaned.whatsappNote,
    published: cleaned.published,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(course);
  await saveCourses(list);
  return course;
}

export async function updateCourse(
  id: string,
  input: CourseInput
): Promise<Course | null> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const slug = uniqueSlug(
    cleaned.slug || cleaned.title || list[idx].slug,
    list.filter((c) => c.id !== id).map((c) => c.slug)
  );

  const next: Course = {
    ...list[idx],
    title: cleaned.title,
    slug,
    coverImage: cleaned.coverImage,
    price: cleaned.price,
    duration: cleaned.duration,
    level: cleaned.level,
    description: cleaned.description,
    whatsappNote: cleaned.whatsappNote,
    published: cleaned.published,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  await saveCourses(list);
  return next;
}

export async function deleteCourse(id: string): Promise<Course | null> {
  const list = await getCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await saveCourses(list);
  return removed;
}
