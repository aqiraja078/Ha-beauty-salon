import { randomBytes, randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type {
  Slip,
  SlipInput,
  SlipItem,
  SlipPaymentMethod,
} from "@/lib/slips-types";
import { SLIP_PAYMENT_LABELS } from "@/lib/slips-types";

const STORE_KEY = "salon-slips";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "slips.json");

async function readLocal(): Promise<Slip[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const parsed = JSON.parse(await fs.readFile(FILE, "utf-8")) as Slip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(list: Slip[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function getBlobStore() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

export async function getSlips(): Promise<Slip[]> {
  try {
    const store = await getBlobStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return data as Slip[];
      } catch {
        /* fall through */
      }
    }
    return await readLocal();
  } catch {
    return [];
  }
}

async function saveSlips(list: Slip[]) {
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

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function money(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.round(n), 100_000_000) : 0;
}

function isoDate(v: unknown): string {
  const s = str(v, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : new Date().toISOString().slice(0, 10);
}

/** Validate + normalise untrusted input (used by the API for both create + update). */
export function cleanSlipInput(raw: unknown): SlipInput | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const c = (b.client && typeof b.client === "object" ? b.client : {}) as Record<
    string,
    unknown
  >;
  const client = {
    name: str(c.name, 120),
    phone: str(c.phone, 40),
    email: str(c.email, 120).toLowerCase(),
    address: str(c.address, 240),
    idCard: str(c.idCard, 30),
  };
  if (!client.name) return null;

  const items: SlipItem[] = (Array.isArray(b.items) ? b.items : [])
    .slice(0, 60)
    .map((it): SlipItem | null => {
      if (!it || typeof it !== "object") return null;
      const r = it as Record<string, unknown>;
      const description = str(r.description, 160);
      if (!description) return null;
      return {
        id: str(r.id, 60) || randomUUID(),
        description,
        qty: Math.max(1, Math.min(Math.round(money(r.qty)) || 1, 999)),
        price: money(r.price),
      };
    })
    .filter((x): x is SlipItem => x !== null);
  if (items.length === 0) return null;

  const method = str(b.paymentMethod, 20) as SlipPaymentMethod;
  return {
    date: isoDate(b.date),
    client,
    appointment: str(b.appointment, 120),
    staff: str(b.staff, 80),
    items,
    discount: money(b.discount),
    advance: money(b.advance),
    paymentMethod: method in SLIP_PAYMENT_LABELS ? method : "cash",
    notes: str(b.notes, 600),
  };
}

function nextNumber(list: Slip[]): string {
  const max = list.reduce((m, s) => {
    const n = Number(s.number.replace(/\D/g, ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ADAA-${String(max + 1).padStart(4, "0")}`;
}

export async function addSlip(input: SlipInput): Promise<Slip> {
  const list = await getSlips();
  const now = new Date().toISOString();
  const slip: Slip = {
    ...input,
    id: randomUUID(),
    publicId: randomBytes(12).toString("base64url"),
    number: nextNumber(list),
    createdAt: now,
    updatedAt: now,
  };
  await saveSlips([slip, ...list]);
  return slip;
}

export async function updateSlip(
  id: string,
  input: SlipInput
): Promise<Slip | null> {
  const list = await getSlips();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  const next: Slip = {
    ...list[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  await saveSlips(list);
  return next;
}

export async function deleteSlip(id: string): Promise<Slip | null> {
  const list = await getSlips();
  const found = list.find((s) => s.id === id) ?? null;
  if (!found) return null;
  await saveSlips(list.filter((s) => s.id !== id));
  return found;
}

export async function getSlipById(id: string): Promise<Slip | null> {
  return (await getSlips()).find((s) => s.id === id) ?? null;
}

export async function getSlipByPublicId(publicId: string): Promise<Slip | null> {
  if (!/^[A-Za-z0-9_-]{10,40}$/.test(publicId)) return null;
  return (await getSlips()).find((s) => s.publicId === publicId) ?? null;
}
