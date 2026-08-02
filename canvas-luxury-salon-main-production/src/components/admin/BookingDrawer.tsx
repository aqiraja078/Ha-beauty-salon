"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClientAvatar, StatusPill } from "@/components/admin/console-ui";
import {
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconClose,
  IconMail,
  IconPhone,
  IconScissors,
  IconXCircle,
} from "@/components/admin/icons";
import {
  bookingRef,
  formatDay,
  formatTime,
  STATUS_TONES,
} from "@/lib/admin-console";
import type { Booking, BookingStatus } from "@/lib/bookings-types";
import { formatFromPrice } from "@/lib/format-price";

const ACTIONS: {
  status: BookingStatus;
  label: string;
  Icon: typeof IconClock;
}[] = [
  { status: "pending", label: "Pending", Icon: IconClock },
  { status: "confirmed", label: "Confirm", Icon: IconCheckCircle },
  { status: "cancelled", label: "Cancel", Icon: IconXCircle },
];

export function BookingDrawer({
  booking,
  busy,
  onClose,
  onStatus,
  onDelete,
}: {
  booking: Booking | null;
  busy: boolean;
  onClose: () => void;
  onStatus: (id: string, status: BookingStatus) => void;
  onDelete: (id: string) => void;
}) {
  useEffect(() => {
    if (!booking) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [booking, onClose]);

  return (
    <AnimatePresence>
      {booking ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Booking ${bookingRef(booking.id)}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface"
          >
            <div
              className={`h-1.5 w-full shrink-0 bg-gradient-to-r ${STATUS_TONES[booking.status].bar}`}
              aria-hidden
            />

            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  Ref · {bookingRef(booking.id)}
                </p>
                <p className="mt-2 text-[11px] text-muted">
                  Submitted{" "}
                  {new Date(booking.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent/45 hover:text-accent"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 px-6">
              <ClientAvatar name={booking.name} className="h-12 w-12 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-display text-xl text-ink">
                  {booking.name}
                </p>
                <div className="mt-1.5">
                  <StatusPill status={booking.status} />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 px-6">
              <a
                href={`mailto:${encodeURIComponent(booking.email)}`}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas/60 px-4 py-3 text-sm text-ink-soft transition hover:border-accent/45 hover:text-accent"
              >
                <IconMail className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate">{booking.email}</span>
              </a>
              <a
                href={`tel:${booking.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas/60 px-4 py-3 text-sm text-ink-soft transition hover:border-accent/45 hover:text-accent"
              >
                <IconPhone className="h-4 w-4 shrink-0 text-accent" />
                {booking.phone}
              </a>
            </div>

            <div className="mt-4 px-6">
              <div className="rounded-xl border border-line bg-canvas/60 p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  <IconScissors className="h-3.5 w-3.5 text-accent" />
                  Service
                </p>
                <p className="mt-2.5 text-sm font-medium leading-snug text-ink">
                  {booking.service}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Price from
                </p>
                <p className="mt-1 text-sm font-semibold text-accent">
                  {formatFromPrice(booking.priceLabel)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft">
                    <IconCalendar className="h-3.5 w-3.5 text-muted" />
                    {formatDay(booking.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft px-3 py-1.5 text-xs text-accent">
                    <IconClock className="h-3.5 w-3.5" />
                    {formatTime(booking.time)}
                  </span>
                </div>
              </div>
            </div>

            {booking.message ? (
              <div className="mt-4 px-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Client note
                </p>
                <p className="mt-2 border-l-2 border-accent/35 pl-3 text-sm leading-relaxed text-ink-soft">
                  {booking.message}
                </p>
              </div>
            ) : null}

            <div className="mt-auto border-t border-line bg-canvas-alt px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                Update status
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ACTIONS.map(({ status, label, Icon }) => {
                  const active = booking.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={busy || active}
                      onClick={() => onStatus(booking.id, status)}
                      className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl border text-[11px] font-semibold transition duration-300 disabled:cursor-not-allowed ${
                        active
                          ? `${STATUS_TONES[status].pill} opacity-100`
                          : "border-line bg-surface text-ink-soft hover:border-accent/45 hover:text-accent disabled:opacity-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => onDelete(booking.id)}
                className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconXCircle className="h-4 w-4" />
                {busy ? "Deleting…" : "Delete booking"}
              </button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
