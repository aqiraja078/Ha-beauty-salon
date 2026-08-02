"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOKING_FIELD_LIMITS } from "@/lib/booking-validation";
import { formatFromPrice } from "@/lib/format-price";
import { bookingServices as bookingServicesFallback } from "@/lib/site";

const times = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

type FormProps = {
  defaultService?: string;
  /** Explicit price from length-aware service cards. */
  defaultPrice?: string;
  services?: string[];
  /** Service name → menu price (from CMS). */
  servicePrices?: Record<string, string>;
};

const labelClass =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

export function BookingForm({
  defaultService,
  defaultPrice,
  services,
  servicePrices = {},
}: FormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");
  const [serviceVal, setServiceVal] = useState("");

  const bookingServices = services?.length
    ? services
    : bookingServicesFallback;

  const serviceOptions = useMemo(() => {
    if (defaultService && !bookingServices.includes(defaultService)) {
      return [defaultService, ...bookingServices];
    }
    return bookingServices;
  }, [defaultService, bookingServices]);

  const selectedPrice = serviceVal
    ? formatFromPrice(
        serviceVal === defaultService && defaultPrice
          ? defaultPrice
          : servicePrices[serviceVal]
      )
    : null;

  useEffect(() => {
    if (defaultService) {
      setServiceVal(defaultService);
    }
  }, [defaultService]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setMsg("");
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || ""),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      message: String(fd.get("message") || ""),
      price:
        serviceVal === defaultService && defaultPrice
          ? defaultPrice
          : servicePrices[serviceVal] || undefined,
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("ok");
      setMsg(
        "Your appointment request has been received. We will confirm shortly."
      );
      form.reset();
      setServiceVal(defaultService ?? "");
    } catch (err) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <motion.form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft sm:rounded-[2rem] sm:p-9 md:p-11"
      aria-busy={status === "loading"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="eyebrow">Appointment details</p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
        Tell us about your visit
      </h2>
      <div
        className="mt-4 h-[3px] w-14 rounded-full bg-gradient-to-r from-accent to-tint"
        aria-hidden
      />

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
        <label className="block sm:col-span-2">
          <span className={labelClass}>Full name</span>
          <input
            name="name"
            required
            maxLength={BOOKING_FIELD_LIMITS.name}
            autoComplete="name"
            className="field"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={BOOKING_FIELD_LIMITS.email}
            autoComplete="email"
            className="field"
            placeholder="you@email.com"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Phone</span>
          <input
            name="phone"
            type="tel"
            required
            maxLength={BOOKING_FIELD_LIMITS.phone}
            autoComplete="tel"
            className="field"
            placeholder="+92 ..."
          />
        </label>

        <div className="block sm:col-span-2">
          <label className="block">
            <span className={labelClass}>Service</span>
            <select
              name="service"
              required
              value={serviceVal}
              onChange={(e) => setServiceVal(e.target.value)}
              className="field"
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <AnimatePresence mode="wait">
            {selectedPrice ? (
              <motion.p
                key={serviceVal}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3 text-sm"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Price from
                </span>
                <span className="font-semibold text-accent">{selectedPrice}</span>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <label className="block">
          <span className={labelClass}>Preferred date</span>
          <input
            name="date"
            type="date"
            required
            min={minDate}
            className="field"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Preferred time</span>
          <select name="time" required className="field" defaultValue="">
            <option value="" disabled>
              Select time
            </option>
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Notes (optional)</span>
          <textarea
            name="message"
            rows={4}
            maxLength={BOOKING_FIELD_LIMITS.message}
            className="field resize-none"
            placeholder="Occasion, allergies, inspiration..."
          />
        </label>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 rounded-2xl border px-4 py-3.5 text-sm ${
              status === "ok"
                ? "border-accent/25 bg-accent-soft text-accent-strong"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request appointment"}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        No payment required to request a slot. Prices shown are from the menu
        and may be confirmed after consultation.
      </p>
    </motion.form>
  );
}
