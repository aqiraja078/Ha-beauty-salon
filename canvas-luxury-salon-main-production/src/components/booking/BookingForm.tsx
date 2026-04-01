"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BOOKING_FIELD_LIMITS } from "@/lib/booking-validation";
import { bookingServices } from "@/lib/site";

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

type FormProps = { defaultService?: string };

export function BookingForm({ defaultService }: FormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");
  const [serviceVal, setServiceVal] = useState("");

  const serviceOptions = useMemo(() => {
    if (defaultService && !bookingServices.includes(defaultService)) {
      return [defaultService, ...bookingServices];
    }
    return bookingServices;
  }, [defaultService]);

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
      setMsg("Your appointment request has been received. We will confirm shortly.");
      form.reset();
      // Keep deep-linked / preselected service after reset (controlled select).
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
      className="glass-panel mx-auto max-w-xl space-y-5 rounded-2xl p-5 sm:space-y-6 sm:rounded-3xl sm:p-8 md:p-10"
      aria-busy={status === "loading"}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Full name
          </span>
          <input
            name="name"
            required
            maxLength={BOOKING_FIELD_LIMITS.name}
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={BOOKING_FIELD_LIMITS.email}
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            required
            maxLength={BOOKING_FIELD_LIMITS.phone}
            autoComplete="tel"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            placeholder="+92 ..."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Service
          </span>
          <select
            name="service"
            required
            value={serviceVal}
            onChange={(e) => setServiceVal(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
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
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Preferred date
          </span>
          <input
            name="date"
            type="date"
            required
            min={minDate}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Preferred time
          </span>
          <select
            name="time"
            required
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            defaultValue=""
          >
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
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Notes (optional)
          </span>
          <textarea
            name="message"
            rows={3}
            maxLength={BOOKING_FIELD_LIMITS.message}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            placeholder="Occasion, allergies, inspiration..."
          />
        </label>
      </div>

      {msg && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            status === "ok" ? "text-gold-light" : "text-red-300"
          }`}
        >
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:opacity-95 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Request appointment"}
      </button>
    </motion.form>
  );
}
