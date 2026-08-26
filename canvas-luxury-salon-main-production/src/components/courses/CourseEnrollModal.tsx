"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CourseEnrollTarget = {
  slug: string;
  title: string;
  price?: string;
};

type Props = {
  course: CourseEnrollTarget | null;
  onClose: () => void;
};

const field =
  "w-full rounded-xl border border-line bg-canvas/80 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent/50 focus:bg-surface focus:ring-4 focus:ring-accent/10";

export function CourseEnrollModal({ course, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!course) return;
    setName("");
    setPhone("");
    setEmail("");
    setCity("");
    setMessage("");
    setError("");
    setDone(false);
    setBusy(false);
  }, [course]);

  useEffect(() => {
    if (!course) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [course]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          name,
          phone,
          email,
          city,
          message,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        whatsappUrl?: string;
      };
      if (!res.ok) throw new Error(data.error || "Submit failed");

      setDone(true);
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {course ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-enroll-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface shadow-lift-lg sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Enroll now
                </p>
                <h2
                  id="course-enroll-title"
                  className="mt-1 font-display text-xl text-ink sm:text-2xl"
                >
                  {course.title}
                </h2>
                {course.price ? (
                  <p className="mt-1 text-sm font-medium text-accent">
                    {course.price}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
              >
                ✕
              </button>
            </div>

            {done ? (
              <div className="space-y-3 px-5 py-8 text-center">
                <p className="font-display text-2xl text-ink">Request sent</p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Saved for the salon admin with your details and course price.
                  WhatsApp also opened so you can confirm in one tap.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary mt-2 inline-flex"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => void onSubmit(e)}
                className="space-y-3.5 p-5"
              >
                <p className="text-xs leading-relaxed text-ink-soft">
                  Fill your details — we save them to the admin console (with
                  course price) and open WhatsApp to the salon.
                </p>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Full name *
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                    autoComplete="name"
                    disabled={busy}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Phone / WhatsApp *
                  </span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={field}
                    placeholder="03XX XXXXXXX"
                    autoComplete="tel"
                    disabled={busy}
                  />
                </label>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={field}
                      autoComplete="email"
                      disabled={busy}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      City
                    </span>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={field}
                      placeholder="Jhelum / Dina / Gujrat"
                      disabled={busy}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Message
                  </span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${field} resize-none`}
                    placeholder="Batch timing, questions…"
                    disabled={busy}
                  />
                </label>

                {error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary flex w-full min-h-12 items-center justify-center"
                >
                  {busy ? "Sending…" : "Submit & send on WhatsApp"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
