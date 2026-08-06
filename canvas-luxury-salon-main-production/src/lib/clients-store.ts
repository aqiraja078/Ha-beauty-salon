import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";
import type { SalonClient, SalonClientInput } from "@/lib/clients-types";

const STORE_KEY = "salon-clients";
const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "clients.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocal(): Promise<SalonClient[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as SalonClient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(list: SalonClient[]) {
  await ensureDataDir();
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}

async function getClientsStore() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

function cleanInput(input: SalonClientInput): Omit<SalonClientInput, "name"> & {
  name: string;
} {
  const name = input.name.trim().slice(0, 120);
  return {
    name,
    phone: (input.phone ?? "").trim().slice(0, 40),
    email: (input.email ?? "").trim().toLowerCase().slice(0, 120) || undefined,
    idCard: (input.idCard ?? "").trim().slice(0, 30) || undefined,
    area: (input.area ?? "").trim().slice(0, 60) || undefined,
    address: (input.address ?? "").trim().slice(0, 240) || undefined,
    notes: (input.notes ?? "").trim().slice(0, 1000) || undefined,
    preferences: (input.preferences ?? "").trim().slice(0, 400) || undefined,
  };
}

export async function getClients(): Promise<SalonClient[]> {
  try {
    const store = await getClientsStore();
    if (store) {
      try {
        const data = await store.get(STORE_KEY, { type: "json" });
        if (Array.isArray(data)) return data as SalonClient[];
      } catch {
        /* fall through */
      }
    }
    return await readLocal();
  } catch {
    return [];
  }
}

async function saveClients(list: SalonClient[]) {
  const store = await getClientsStore();
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

export async function addClient(input: SalonClientInput): Promise<SalonClient> {
  const cleaned = cleanInput(input);
  if (!cleaned.name) throw new Error("Name is required");

  const now = new Date().toISOString();
  const client: SalonClient = {
    id: randomUUID(),
    name: cleaned.name,
    phone: cleaned.phone ?? "",
    email: cleaned.email,
    idCard: cleaned.idCard,
    area: cleaned.area,
    address: cleaned.address,
    notes: cleaned.notes,
    preferences: cleaned.preferences,
    createdAt: now,
    updatedAt: now,
  };

  const list = await getClients();
  list.unshift(client);
  await saveClients(list);
  return client;
}

export async function updateClient(
  id: string,
  input: SalonClientInput
): Promise<SalonClient | null> {
  const cleaned = cleanInput(input);
  if (!cleaned.name) throw new Error("Name is required");

  const list = await getClients();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const next: SalonClient = {
    ...list[idx],
    name: cleaned.name,
    phone: cleaned.phone ?? "",
    email: cleaned.email,
    idCard: cleaned.idCard,
    area: cleaned.area,
    address: cleaned.address,
    notes: cleaned.notes,
    preferences: cleaned.preferences,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = next;
  await saveClients(list);
  return next;
}

export async function deleteClient(id: string): Promise<SalonClient | null> {
  const list = await getClients();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await saveClients(list);
  return removed;
}
