"use client";

import { StatusPill } from "@/components/admin/console-ui";
import {
  formatDay,
  formatTime,
  bookingRef,
} from "@/lib/admin-console";
import { BOOKING_TIME_SLOTS } from "@/lib/booking-slots";
import type { Booking, BookingArea } from "@/lib/bookings-types";
import { bookingAreaLabel, holdsBookingSlot } from "@/lib/bookings-types";

export function AdminDayCalendar({
  rows,
  day,
  onDayChange,
  areaFilter,
  onView,
}: {
  rows: Booking[];
  day: string;
  onDayChange: (d: string) => void;
  areaFilter: BookingArea | "all";
  onView: (b: Booking) => void;
}) {
  const dayRows = rows
    .filter((b) => b.date === day)
    .filter((b) => areaFilter === "all" || b.area === areaFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const bySlot = new Map<string, Booking[]>();
  for (const slot of BOOKING_TIME_SLOTS) bySlot.set(slot, []);
  for (const b of dayRows) {
    const list = bySlot.get(b.time) ?? [];
    list.push(b);
    bySlot.set(b.time, list);
  }

  const holding = dayRows.filter((b) => holdsBookingSlot(b.status)).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Day
          </span>
          <input
            type="date"
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
            className="console-field cursor-pointer"
          />
        </label>
        <p className="text-xs text-muted">
          <span className="font-semibold text-ink">{formatDay(day)}</span>
          {" · "}
          {dayRows.length} booking{dayRows.length === 1 ? "" : "s"}
          {" · "}
          {holding} holding slot{holding === 1 ? "" : "s"}
        </p>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {BOOKING_TIME_SLOTS.map((slot) => {
          const list = bySlot.get(slot) ?? [];
          return (
            <div
              key={slot}
              className="grid gap-3 bg-surface px-4 py-3 sm:grid-cols-[88px_1fr] sm:items-start"
            >
              <p className="pt-0.5 font-mono text-xs font-semibold tabular-nums text-accent">
                {formatTime(slot)}
              </p>
              {list.length === 0 ? (
                <p className="text-xs text-muted">Open</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => onView(b)}
                        className="flex w-full flex-col gap-1 rounded-lg border border-line bg-canvas/70 px-3 py-2 text-left transition hover:border-accent/40"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-ink">
                            {b.name}
                          </span>
                          <StatusPill status={b.status} />
                          <span className="font-mono text-[10px] text-muted">
                            {bookingRef(b.id)}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft">
                          {b.service}
                          {" · "}
                          {bookingAreaLabel(b.area)}
                          {b.priceLabel ? ` · ${b.priceLabel}` : ""}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {dayRows.some((b) => !BOOKING_TIME_SLOTS.includes(b.time as (typeof BOOKING_TIME_SLOTS)[number])) ? (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Other times
          </p>
          <ul className="space-y-2">
            {dayRows
              .filter(
                (b) =>
                  !(BOOKING_TIME_SLOTS as readonly string[]).includes(b.time)
              )
              .map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => onView(b)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-accent/40"
                  >
                    <span>
                      {formatTime(b.time)} · {b.name} · {b.service}
                    </span>
                    <StatusPill status={b.status} />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
