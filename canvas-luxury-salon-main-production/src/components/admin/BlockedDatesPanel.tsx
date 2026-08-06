"use client";

import { useCallback, useEffect, useState } from "react";
import { IconBan, IconClose } from "@/components/admin/icons";
import { formatDay } from "@/lib/admin-console";

export function BlockedDatesPanel() {
  const [dates, setDates] = useState<string[]>([]);
  const [addDate, setAddDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blocked-dates");
      if (!res.ok) throw new Error("Could not load blocked dates");
      const data = (await res.json()) as { dates?: string[] };
      setDates(Array.isArray(data.dates) ? data.dates : []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: string[]) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: next }),
      });
      if (!res.ok) throw new Error("Could not save");
      const data = (await res.json()) as { dates?: string[] };
      setDates(Array.isArray(data.dates) ? data.dates : next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function add() {
    if (!addDate) return;
    if (dates.includes(addDate)) {
      setAddDate("");
      return;
    }
    const next = [...dates, addDate].sort();
    setAddDate("");
    void save(next);
  }

  function remove(d: string) {
    void save(dates.filter((x) => x !== d));
  }

  return (
    <section className="console-card p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <IconBan className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg text-ink">Block dates</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Off days / fully booked — clients cannot book these dates on the
            form.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="block min-w-[160px] flex-1">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Add date
          </span>
          <input
            type="date"
            value={addDate}
            onChange={(e) => setAddDate(e.target.value)}
            className="console-field cursor-pointer"
            disabled={busy}
          />
        </label>
        <button
          type="button"
          disabled={busy || !addDate}
          onClick={add}
          className="console-btn min-h-[40px]"
        >
          Block date
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-600" role="status">
          {error}
        </p>
      ) : null}

      <ul className="mt-5 space-y-2">
        {!loaded ? (
          <li className="text-sm text-muted">Loading…</li>
        ) : dates.length === 0 ? (
          <li className="text-sm text-muted">No blocked dates yet.</li>
        ) : (
          dates.map((d) => (
            <li
              key={d}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas/60 px-4 py-2.5"
            >
              <span className="text-sm text-ink">
                {formatDay(d)}
                <span className="ml-2 font-mono text-[11px] text-muted">
                  {d}
                </span>
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(d)}
                aria-label={`Unblock ${d}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
