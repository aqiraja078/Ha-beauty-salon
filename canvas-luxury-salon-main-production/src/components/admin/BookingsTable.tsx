"use client";

import { motion } from "framer-motion";
import {
  ClientAvatar,
  StatusPill,
} from "@/components/admin/console-ui";
import {
  IconCalendar,
  IconClock,
  IconScissors,
} from "@/components/admin/icons";
import { bookingRef, formatDay, formatTime } from "@/lib/admin-console";
import type { Booking } from "@/lib/bookings-types";
import { bookingAreaLabel } from "@/lib/bookings-types";
import { formatFromPrice } from "@/lib/format-price";

const HEADS = [
  "Ref",
  "Service",
  "Area",
  "Price",
  "Client",
  "Date",
  "Time",
  "Status",
  "Action",
];

export function BookingsTable({
  rows,
  onView,
  onDelete,
  busyId,
  emptyTitle,
  emptyHint,
}: {
  rows: Booking[];
  onView: (b: Booking) => void;
  onDelete: (id: string) => void;
  busyId?: string | null;
  emptyTitle: string;
  emptyHint?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-xl text-ink">{emptyTitle}</p>
        {emptyHint ? (
          <p className="mt-2 text-sm text-ink-soft">{emptyHint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Desktop ledger */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              {HEADS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap bg-canvas-alt px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-muted first:rounded-l-xl first:pl-5 last:rounded-r-xl last:pr-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <motion.tr
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.3 }}
                className="group border-b border-line transition-colors last:border-0 hover:bg-accent-soft/40"
              >
                <td className="border-b border-line px-4 py-4 pl-5 font-mono text-[13px] font-semibold text-ink group-last:border-0">
                  {bookingRef(b.id)}
                </td>
                <td className="border-b border-line px-4 py-4 group-last:border-0">
                  <span className="inline-flex max-w-[15rem] items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-ink-soft">
                    <IconScissors className="h-3.5 w-3.5 shrink-0 text-accent" />
                    <span className="truncate">{b.service}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap border-b border-line px-4 py-4 text-[13px] text-ink-soft group-last:border-0">
                  {bookingAreaLabel(b.area)}
                </td>
                <td className="whitespace-nowrap border-b border-line px-4 py-4 text-[13px] font-semibold text-accent group-last:border-0">
                  {formatFromPrice(b.priceLabel)}
                </td>
                <td className="border-b border-line px-4 py-4 group-last:border-0">
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={b.name} />
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-[13px] font-medium text-ink">
                        {b.name}
                      </p>
                      <p className="truncate text-[11px] text-muted">{b.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap border-b border-line px-4 py-4 text-[13px] text-ink-soft group-last:border-0">
                  <span className="inline-flex items-center gap-1.5">
                    <IconCalendar className="h-3.5 w-3.5 text-muted" />
                    {formatDay(b.date)}
                  </span>
                </td>
                <td className="whitespace-nowrap border-b border-line px-4 py-4 text-[13px] text-ink-soft group-last:border-0">
                  <span className="inline-flex items-center gap-1.5">
                    <IconClock className="h-3.5 w-3.5 text-muted" />
                    {formatTime(b.time)}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-4 group-last:border-0">
                  <StatusPill status={b.status} />
                </td>
                <td className="border-b border-line px-4 py-4 pr-5 group-last:border-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView(b)}
                      className="console-btn-soft min-h-[32px] px-4"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      disabled={busyId === b.id}
                      onClick={() => onDelete(b.id)}
                      className="inline-flex min-h-[32px] items-center rounded-full border border-rose-200 bg-rose-50 px-4 text-xs font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyId === b.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border border-line bg-canvas/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <ClientAvatar name={b.name} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {bookingRef(b.id)}
                  </p>
                </div>
              </div>
              <StatusPill status={b.status} />
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <IconScissors className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate">{b.service}</span>
            </p>
            {b.area ? (
              <p className="mt-1.5 text-xs text-muted">
                Area: {bookingAreaLabel(b.area)}
              </p>
            ) : null}
            <p className="mt-2 text-sm font-semibold text-accent">
              {formatFromPrice(b.priceLabel)}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <IconCalendar className="h-3.5 w-3.5 text-muted" />
                {formatDay(b.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="h-3.5 w-3.5 text-muted" />
                {formatTime(b.time)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onView(b)}
                className="console-btn-soft w-full"
              >
                View details
              </button>
              <button
                type="button"
                disabled={busyId === b.id}
                onClick={() => onDelete(b.id)}
                className="inline-flex min-h-[36px] w-full items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-xs font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyId === b.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
