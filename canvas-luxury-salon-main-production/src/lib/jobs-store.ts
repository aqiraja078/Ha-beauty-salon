import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { JobPost, JobPostInput, JobType } from "@/lib/jobs-types";
import { isJobType } from "@/lib/jobs-types";
import { uniqueSlug } from "@/lib/content-slug";
import { rebrandLegacy } from "@/lib/legacy-brand";

const STORE_KEY = "salon-jobs";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "jobs.json");

function seedJobs(): JobPost[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      title: "Makeup artist (home service)",
      slug: "makeup-artist-home-service",
      location: "Jhelum · Dina · Gujrat",
      type: "Full-time",
      salaryText: "Commission + travel",
      description:
        "Looking for experienced bridal and party makeup artists for home visits. Own kit preferred. Reliable timing and WhatsApp communication required.",
      applyWhatsApp: "923355462214",
      applyEmail: "adaabeautysalonjhelum@gmail.com",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      title: "Salon assistant (part-time)",
      slug: "salon-assistant-part-time",
      location: "Jhelum",
      type: "Part-time",
      salaryText: "Negotiable",
      description:
        "Help with packing kits, booking follow-ups, and on-site setup for weekend functions. Flexible hours.",
      applyWhatsApp: "923355462214",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<JobPost[] | null> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as JobPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

async function writeLocal(list: JobPost[]) {
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

function cleanInput(input: JobPostInput) {
  const title = input.title.trim().slice(0, 160);
  const type: JobType =
    input.type && isJobType(input.type) ? input.type : "Full-time";
  return {
    title,
    slug: (input.slug ?? "").trim().slice(0, 80),
    location: (input.location ?? "").trim().slice(0, 120) || undefined,
    type,
    salaryText: (input.salaryText ?? "").trim().slice(0, 120) || undefined,
    description: (input.description ?? "").trim().slice(0, 8000),
    applyWhatsApp:
      (input.applyWhatsApp ?? "").replace(/\D/g, "").slice(0, 20) || undefined,
    applyEmail:
      (input.applyEmail ?? "").trim().toLowerCase().slice(0, 120) || undefined,
    active: input.active !== false,
  };
}

export async function getJobs(): Promise<JobPost[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return rebrandLegacy(data as JobPost[]);
      } catch {
        /* fall through */
      }
    }
    const local = await readLocal();
    if (local) return rebrandLegacy(local);
    const seeded = seedJobs();
    await writeLocal(seeded);
    return seeded;
  } catch {
    return seedJobs();
  }
}

async function saveJobs(list: JobPost[]) {
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

export async function getActiveJobs(): Promise<JobPost[]> {
  const list = await getJobs();
  return list
    .filter((j) => j.active)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getJobBySlug(slug: string): Promise<JobPost | null> {
  const list = await getJobs();
  return list.find((j) => j.slug === slug) ?? null;
}

export async function addJob(input: JobPostInput): Promise<JobPost> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getJobs();
  const slug = uniqueSlug(
    cleaned.slug || cleaned.title,
    list.map((j) => j.slug)
  );
  const now = new Date().toISOString();
  const job: JobPost = {
    id: randomUUID(),
    title: cleaned.title,
    slug,
    location: cleaned.location,
    type: cleaned.type,
    salaryText: cleaned.salaryText,
    description: cleaned.description,
    applyWhatsApp: cleaned.applyWhatsApp,
    applyEmail: cleaned.applyEmail,
    active: cleaned.active,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(job);
  await saveJobs(list);
  return job;
}

export async function updateJob(
  id: string,
  input: JobPostInput
): Promise<JobPost | null> {
  const cleaned = cleanInput(input);
  if (!cleaned.title) throw new Error("Title is required");

  const list = await getJobs();
  const idx = list.findIndex((j) => j.id === id);
  if (idx === -1) return null;

  const slug = uniqueSlug(
    cleaned.slug || cleaned.title || list[idx].slug,
    list.filter((j) => j.id !== id).map((j) => j.slug)
  );

  const next: JobPost = {
    ...list[idx],
    title: cleaned.title,
    slug,
    location: cleaned.location,
    type: cleaned.type,
    salaryText: cleaned.salaryText,
    description: cleaned.description,
    applyWhatsApp: cleaned.applyWhatsApp,
    applyEmail: cleaned.applyEmail,
    active: cleaned.active,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  await saveJobs(list);
  return next;
}

export async function deleteJob(id: string): Promise<JobPost | null> {
  const list = await getJobs();
  const idx = list.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await saveJobs(list);
  return removed;
}
