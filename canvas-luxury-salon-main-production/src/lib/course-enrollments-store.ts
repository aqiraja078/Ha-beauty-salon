import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type {
  CourseEnrollment,
  CourseEnrollmentInput,
  CourseEnrollmentStatus,
} from "@/lib/course-enrollments-types";

const STORE_KEY = "salon-course-enrollments";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "course-enrollments.json");

const STATUSES: CourseEnrollmentStatus[] = [
  "pending",
  "approved",
  "rejected",
];

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function normalize(row: CourseEnrollment): CourseEnrollment {
  const status = STATUSES.includes(row.status) ? row.status : "pending";
  return { ...row, status };
}

async function readLocal(): Promise<CourseEnrollment[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as CourseEnrollment[];
    return Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch {
    return [];
  }
}

async function writeLocal(list: CourseEnrollment[]) {
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

function clean(
  input: CourseEnrollmentInput
): Omit<CourseEnrollment, "id" | "createdAt"> {
  const status =
    input.status && STATUSES.includes(input.status) ? input.status : "pending";
  return {
    courseId: input.courseId.trim().slice(0, 80),
    courseTitle: input.courseTitle.trim().slice(0, 160),
    courseSlug: input.courseSlug.trim().slice(0, 80),
    coursePrice: (input.coursePrice ?? "").trim().slice(0, 80) || undefined,
    courseDuration:
      (input.courseDuration ?? "").trim().slice(0, 80) || undefined,
    name: input.name.trim().slice(0, 100),
    phone: input.phone.replace(/[^\d+\s-]/g, "").trim().slice(0, 20),
    email: (input.email ?? "").trim().toLowerCase().slice(0, 120) || undefined,
    city: (input.city ?? "").trim().slice(0, 80) || undefined,
    message: (input.message ?? "").trim().slice(0, 1500) || undefined,
    status,
  };
}

export async function getCourseEnrollments(): Promise<CourseEnrollment[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) {
          return (data as CourseEnrollment[]).map(normalize);
        }
      } catch {
        /* fall through */
      }
    }
    return await readLocal();
  } catch {
    return [];
  }
}

async function saveAll(list: CourseEnrollment[]) {
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

export async function addCourseEnrollment(
  input: CourseEnrollmentInput
): Promise<CourseEnrollment> {
  const cleaned = clean(input);
  if (!cleaned.name) throw new Error("Name is required");
  if (!cleaned.phone || cleaned.phone.replace(/\D/g, "").length < 10) {
    throw new Error("Valid phone is required");
  }
  if (!cleaned.courseId || !cleaned.courseTitle) {
    throw new Error("Course is required");
  }

  const list = await getCourseEnrollments();
  const row: CourseEnrollment = {
    id: randomUUID(),
    ...cleaned,
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  await saveAll(list);
  return row;
}

export async function updateCourseEnrollmentStatus(
  id: string,
  status: CourseEnrollmentStatus
): Promise<CourseEnrollment | null> {
  if (!STATUSES.includes(status)) return null;
  const list = await getCourseEnrollments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status };
  await saveAll(list);
  return list[idx];
}

export async function deleteCourseEnrollment(
  id: string
): Promise<CourseEnrollment | null> {
  const list = await getCourseEnrollments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await saveAll(list);
  return removed;
}
