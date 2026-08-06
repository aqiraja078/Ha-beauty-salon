import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

const STORE_KEY = "blocked-dates";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "blocked-dates.json");

export type BlockedDatesData = {
  /** Full days off (YYYY-MM-DD). */
  dates: string[];
  updatedAt?: string;
};

const EMPTY: BlockedDatesData = { dates: [] };

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<BlockedDatesData> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as BlockedDatesData;
    return {
      dates: Array.isArray(parsed.dates)
        ? parsed.dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
        : [],
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return { ...EMPTY };
  }
}

async function writeLocal(data: BlockedDatesData) {
  await ensureDataDir();
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function getCmsStore() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

export async function getBlockedDates(): Promise<BlockedDatesData> {
  try {
    const store = await getCmsStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (data && typeof data === "object") {
          const parsed = data as BlockedDatesData;
          return {
            dates: Array.isArray(parsed.dates)
              ? parsed.dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
              : [],
            updatedAt: parsed.updatedAt,
          };
        }
      } catch {
        /* fall through */
      }
    }
    return await readLocal();
  } catch {
    return { ...EMPTY };
  }
}

export async function isDateBlocked(date: string): Promise<boolean> {
  const { dates } = await getBlockedDates();
  return dates.includes(date);
}

export async function setBlockedDates(
  dates: string[]
): Promise<BlockedDatesData> {
  const clean = Array.from(
    new Set(dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))
  ).sort();
  const next: BlockedDatesData = {
    dates: clean,
    updatedAt: new Date().toISOString(),
  };
  const store = await getCmsStore();
  if (store) {
    try {
      await store.set(STORE_KEY, JSON.stringify(next));
      return next;
    } catch {
      /* fall through */
    }
  }
  await writeLocal(next);
  return next;
}
