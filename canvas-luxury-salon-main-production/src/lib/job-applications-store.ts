import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type {
  JobApplication,
  JobApplicationInput,
} from "@/lib/job-applications-types";

const STORE_KEY = "salon-job-applications";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "job-applications.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<JobApplication[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as JobApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(list: JobApplication[]) {
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

function clean(input: JobApplicationInput): Omit<JobApplication, "id" | "createdAt"> {
  return {
    jobId: input.jobId.trim().slice(0, 80),
    jobTitle: input.jobTitle.trim().slice(0, 160),
    jobSlug: input.jobSlug.trim().slice(0, 80),
    name: input.name.trim().slice(0, 100),
    phone: input.phone.replace(/[^\d+\s-]/g, "").trim().slice(0, 20),
    email: (input.email ?? "").trim().toLowerCase().slice(0, 120) || undefined,
    city: (input.city ?? "").trim().slice(0, 80) || undefined,
    experience: (input.experience ?? "").trim().slice(0, 200) || undefined,
    message: (input.message ?? "").trim().slice(0, 1500) || undefined,
  };
}

export async function getJobApplications(): Promise<JobApplication[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return data as JobApplication[];
      } catch {
        /* fall through */
      }
    }
    return await readLocal();
  } catch {
    return [];
  }
}

async function saveAll(list: JobApplication[]) {
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

export async function addJobApplication(
  input: JobApplicationInput
): Promise<JobApplication> {
  const cleaned = clean(input);
  if (!cleaned.name) throw new Error("Name is required");
  if (!cleaned.phone || cleaned.phone.replace(/\D/g, "").length < 10) {
    throw new Error("Valid phone is required");
  }
  if (!cleaned.jobId || !cleaned.jobTitle) {
    throw new Error("Job is required");
  }

  const list = await getJobApplications();
  const row: JobApplication = {
    id: randomUUID(),
    ...cleaned,
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  await saveAll(list);
  return row;
}

export async function deleteJobApplication(
  id: string
): Promise<JobApplication | null> {
  const list = await getJobApplications();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await saveAll(list);
  return removed;
}
