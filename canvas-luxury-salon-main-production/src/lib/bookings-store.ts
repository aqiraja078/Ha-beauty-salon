import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Booking, BookingStatus } from "@/lib/bookings-types";

export type { Booking, BookingStatus } from "@/lib/bookings-types";

const BOOKINGS_STORE_KEY = "bookings";
const LOGS_STORE_KEY = "appointments-log";

const DATA_DIR = path.resolve(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const LOG_FILE = path.join(DATA_DIR, "appointments-log.jsonl");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocalBookings(): Promise<Booking[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalBookings(bookings: Booking[]) {
  await ensureDataDir();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

async function appendLocalLog(entry: string) {
  try {
    await ensureDataDir();
    await fs.appendFile(LOG_FILE, `${entry}\n`, "utf-8");
  } catch {
    // Best effort
  }
}

async function getBookingsStore() {
  try {
    return await getStore("bookings");
  } catch {
    // Fallback for local dev without Netlify context
    return null;
  }
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const store = await getBookingsStore();

    if (store) {
      try {
        const data = await store.get(BOOKINGS_STORE_KEY, { type: "json" });
        if (!data) return [];
        const parsed = data as Booking[];
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error("Error reading from blob store, falling back to local file:", err);
      }
    }

    return await readLocalBookings();
  } catch (error) {
    console.error("Error reading bookings:", error);
    return [];
  }
}

export async function addBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking> {
  try {
    const list = await getBookings();
    const booking: Booking = {
      ...input,
      id: randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    list.unshift(booking);

    const store = await getBookingsStore();
    if (store) {
      try {
        await store.set(BOOKINGS_STORE_KEY, JSON.stringify(list));
      } catch (err) {
        console.error("Error writing to blob store, falling back to local file:", err);
        await writeLocalBookings(list);
      }
    } else {
      await writeLocalBookings(list);
    }

    // Append to log (best effort)
    const logEntry = JSON.stringify(booking);
    if (store) {
      try {
        const existingLog = (await store.get(LOGS_STORE_KEY)) || "";
        await store.set(LOGS_STORE_KEY, `${existingLog}${logEntry}\n`);
      } catch (err) {
        console.error("Error writing to blob log store, falling back to local log:", err);
        await appendLocalLog(logEntry);
      }
    } else {
      await appendLocalLog(logEntry);
    }

    return booking;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<{ booking: Booking; previousStatus: BookingStatus } | null> {
  try {
    const list = await getBookings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    const previousStatus = list[idx].status;
    list[idx] = { ...list[idx], status };

    const store = await getBookingsStore();
    if (store) {
      try {
        await store.set(BOOKINGS_STORE_KEY, JSON.stringify(list));
      } catch (err) {
        console.error("Error writing status update to blob store, falling back to local file:", err);
        await writeLocalBookings(list);
      }

      // Log status update
      try {
        const existingLog = (await store.get(LOGS_STORE_KEY)) || "";
        const logEntry = JSON.stringify({
          _event: "status_update",
          id,
          status,
          at: new Date().toISOString(),
          booking: list[idx],
        });
        await store.set(LOGS_STORE_KEY, `${existingLog}${logEntry}\n`);
      } catch (err) {
        console.error("Error writing status log to blob store, falling back to local log:", err);
        const logEntry = JSON.stringify({
          _event: "status_update",
          id,
          status,
          at: new Date().toISOString(),
          booking: list[idx],
        });
        await appendLocalLog(logEntry);
      }
    } else {
      await writeLocalBookings(list);
      const logEntry = JSON.stringify({
        _event: "status_update",
        id,
        status,
        at: new Date().toISOString(),
        booking: list[idx],
      });
      await appendLocalLog(logEntry);
    }

    return { booking: list[idx], previousStatus };
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}
