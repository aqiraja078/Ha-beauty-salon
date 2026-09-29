"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BOOKING_TIME_SLOTS } from "@/lib/booking-slots";

const labelClass =
  "mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted";

const SCENES = [
  {
    id: "type",
    label: "Single click",
    title: "1. Tap Single service",
    caption:
      "Under Booking type, tap “Single service” when you want to book one service.",
    scroll: 0,
  },
  {
    id: "serviceOpen",
    label: "Service list",
    title: "2. The service list opens",
    caption:
      "After Single is selected, the Service dropdown appears. Open it to see your options.",
    scroll: 36,
  },
  {
    id: "servicePick",
    label: "Select service",
    title: "3. Choose your service",
    caption:
      "Tap a service in the list (for example Party Makeup). The “From” price appears below.",
    scroll: 36,
  },
  {
    id: "details",
    label: "Your details",
    title: "4. Add name, email & phone",
    caption:
      "Enter your full name, email (like name@gmail.com), and phone (11–17 digits, + optional).",
    scroll: 140,
  },
  {
    id: "schedule",
    label: "Area & slot",
    title: "5. Pick area, date & time",
    caption:
      "Choose Jhelum, Dina, or Gujrat, then your preferred date and time slot.",
    scroll: 268,
  },
  {
    id: "send",
    label: "Send now",
    title: "6. Tap Send now",
    caption:
      "Tap “Send now” at the bottom — your booking is saved and WhatsApp opens with the details.",
    scroll: 380,
  },
  {
    id: "done",
    label: "Done",
    title: "7. Wait for confirmation",
    caption:
      "Details go to WhatsApp. Our team confirms your slot within 48 hours.",
    scroll: 0,
  },
] as const;

const SCENE_MS = 3600;

const SERVICE_OPTIONS = [
  "Bridal Makeup Barat",
  "Party Makeup",
  "Hair Color & Styling",
  "Facial Treatment",
] as const;

const DEMO = {
  service: "Party Makeup",
  price: "From PKR 3,000",
  name: "Ayesha Khan",
  email: "ayesha@gmail.com",
  phone: "+923001234567",
  area: "jhelum" as const,
  date: "2026-08-20",
  time: "16:00",
};

const AREAS = [
  { id: "jhelum", label: "Jhelum" },
  { id: "dina", label: "Dina" },
  { id: "gujrat", label: "Gujrat" },
] as const;

function ring(active: boolean) {
  return active
    ? "ring-2 ring-accent/70 ring-offset-2 ring-offset-[rgb(var(--canvas))]"
    : "";
}

function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="relative z-20 flex items-center justify-between px-5 pb-1 pt-2.5 text-[10px] font-semibold text-ink">
      <span className="tabular-nums" suppressHydrationWarning>
        {timeLabel}
      </span>
      <div className="absolute left-1/2 top-2.5 h-[22px] w-[82px] -translate-x-1/2 rounded-full bg-ink" />
      <div className="flex items-center gap-1">
        <svg viewBox="0 0 18 12" className="h-2.5 w-[16px]" aria-hidden>
          <rect x="0" y="7" width="2.5" height="5" rx="0.5" fill="currentColor" />
          <rect x="4" y="5" width="2.5" height="7" rx="0.5" fill="currentColor" />
          <rect x="8" y="3" width="2.5" height="9" rx="0.5" fill="currentColor" />
          <rect x="12" y="1" width="2.5" height="11" rx="0.5" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" aria-hidden>
          <path
            d="M1 4.2C2.8 2.5 5.2 1.5 8 1.5s5.2 1 7 2.7l-1.2 1.2C12.4 4 10.3 3.2 8 3.2S3.6 4 2.2 5.4L1 4.2zm2.5 2.5c1.2-1.1 2.8-1.7 4.5-1.7s3.3.6 4.5 1.7L11.3 8C10.4 7.2 9.3 6.7 8 6.7S5.6 7.2 4.7 8L3.5 6.7zM8 11l-1.8-1.8c.5-.5 1.1-.7 1.8-.7s1.3.2 1.8.7L8 11z"
            fill="currentColor"
          />
        </svg>
        <span className="relative ml-0.5 flex h-[9px] w-[18px] items-center rounded-[2px] border border-ink/80 px-px">
          <span className="h-full w-[70%] rounded-[1px] bg-ink" />
          <span className="absolute -right-[2px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-ink/80" />
        </span>
      </div>
    </div>
  );
}

function BrowserChrome() {
  return (
    <div className="relative z-10 border-b border-line/70 bg-surface/95 px-2.5 py-1.5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1.5">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent/15 text-[8px] font-bold text-accent">
          A
        </span>
        <span className="min-w-0 flex-1 truncate text-[10px] text-ink-soft">
          adaa-beauty-salon/book
        </span>
        <span className="text-[9px] text-muted">↻</span>
      </div>
    </div>
  );
}

function MiniBookingForm({
  sceneId,
  scrollY,
}: {
  sceneId: (typeof SCENES)[number]["id"];
  scrollY: number;
}) {
  const tappingSingle = sceneId === "type";
  const showServiceField = sceneId !== "type";
  const listOpen = sceneId === "serviceOpen" || sceneId === "servicePick";
  const servicePicked = [
    "servicePick",
    "details",
    "schedule",
    "send",
    "done",
  ].includes(sceneId);
  const showDetails = ["details", "schedule", "send", "done"].includes(sceneId);
  const showSchedule = ["schedule", "send", "done"].includes(sceneId);
  const sending = sceneId === "send";
  const done = sceneId === "done";

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-canvas px-5 text-center">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift-lg"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.span>
        <p className="font-display text-xl text-ink">Booking sent</p>
        <p className="max-w-[16rem] text-[11px] leading-snug text-ink-soft">
          WhatsApp is open — we’ll confirm your slot within 48 hours.
        </p>
        <div className="w-full rounded-2xl border border-accent/25 bg-surface px-3.5 py-3 text-left shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Summary
          </p>
          <p className="mt-1 text-sm font-semibold text-accent">{DEMO.service}</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {DEMO.name} · Jhelum · {DEMO.time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-canvas">
      <motion.div
        className="px-3 pb-8 pt-3"
        animate={{ y: -scrollY }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-[1.25rem] border border-line bg-surface p-3.5 shadow-soft">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-tint">
            Appointment details
          </p>
          <h3 className="mt-1 font-display text-[17px] leading-tight text-ink">
            Book your home visit
          </h3>
          <div
            className="mt-2 h-[2.5px] w-10 rounded-full bg-gradient-to-r from-accent to-tint"
            aria-hidden
          />
          <p className="mt-2 text-[11px] leading-snug text-ink-soft">
            Complete the details below, then tap Send now.
          </p>

          <div className="mt-3.5 space-y-3.5">
            <div className={`rounded-xl p-0.5 transition ${ring(sceneId === "type")}`}>
              <span className={labelClass}>Booking type</span>
              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  animate={
                    tappingSingle
                      ? {
                          scale: [1, 0.96, 1],
                        }
                      : { scale: 1 }
                  }
                  transition={
                    tappingSingle
                      ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                  className="relative rounded-xl border border-accent bg-accent-soft px-2 py-2.5 text-center text-[10px] font-semibold text-accent"
                >
                  Single service
                  {tappingSingle ? (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] text-accent-fg shadow-sm">
                      ✓
                    </span>
                  ) : null}
                </motion.div>
                <div className="rounded-xl border border-line px-2 py-2.5 text-center text-[10px] font-semibold text-ink-soft">
                  Multi service
                </div>
              </div>
              {tappingSingle ? (
                <p className="mt-2 text-center text-[9px] font-semibold text-accent">
                  Tap → Single service
                </p>
              ) : null}
            </div>

            <AnimatePresence>
              {showServiceField ? (
                <motion.div
                  key="service-block"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`overflow-hidden rounded-xl p-0.5 transition ${ring(
                    sceneId === "serviceOpen" || sceneId === "servicePick"
                  )}`}
                >
                  <span className={labelClass}>Service</span>
                  <div
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-[11px] ${
                      listOpen && !servicePicked
                        ? "border-accent/60 bg-accent-soft/50 text-ink"
                        : "border-line bg-canvas/70 text-ink"
                    }`}
                  >
                    <span className={servicePicked ? "font-medium" : "text-muted"}>
                      {servicePicked ? DEMO.service : "Select a service"}
                    </span>
                    <motion.span
                      animate={{ rotate: listOpen ? 180 : 0 }}
                      className="text-[9px] text-muted"
                      aria-hidden
                    >
                      ▼
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {listOpen ? (
                      <motion.ul
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
                      >
                        {SERVICE_OPTIONS.map((item) => {
                          const selected =
                            servicePicked && item === DEMO.service;
                          const picking =
                            sceneId === "servicePick" && item === DEMO.service;
                          return (
                            <li key={item}>
                              <motion.div
                                animate={
                                  picking
                                    ? {
                                        backgroundColor: [
                                          "rgb(255 255 255)",
                                          "rgb(228 242 237)",
                                          "rgb(228 242 237)",
                                        ],
                                      }
                                    : {}
                                }
                                transition={{
                                  duration: 0.9,
                                  repeat: picking ? Infinity : 0,
                                }}
                                className={`flex items-center justify-between gap-2 border-b border-line/60 px-3 py-2.5 text-[11px] last:border-0 ${
                                  selected
                                    ? "bg-accent-soft font-semibold text-accent"
                                    : "text-ink"
                                }`}
                              >
                                <span>{item}</span>
                                {selected ? (
                                  <span className="text-[10px] text-accent">✓</span>
                                ) : null}
                              </motion.div>
                            </li>
                          );
                        })}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>

                  {sceneId === "serviceOpen" ? (
                    <p className="mt-2 text-center text-[9px] font-semibold text-accent">
                      List open — choose a service
                    </p>
                  ) : null}

                  {servicePicked ? (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-2xl border border-accent/25 bg-accent-soft px-3 py-2 text-[10px]">
                      <span className="font-semibold uppercase tracking-[0.12em] text-muted">
                        Price from
                      </span>
                      <span className="font-semibold text-accent">
                        {DEMO.price}
                      </span>
                    </div>
                  ) : null}

                  {sceneId === "servicePick" ? (
                    <p className="mt-2 text-center text-[9px] font-semibold text-accent">
                      Selected: {DEMO.service} ✓
                    </p>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div
              className={`space-y-2.5 rounded-xl p-0.5 transition ${ring(
                sceneId === "details"
              )}`}
            >
              {(
                [
                  ["Full name", showDetails ? DEMO.name : "Your name"],
                  ["Email", showDetails ? DEMO.email : "name@gmail.com"],
                  ["Phone", showDetails ? DEMO.phone : "+923001234567"],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <span className={labelClass}>{label}</span>
                  <div
                    className={`rounded-2xl border border-line bg-canvas/70 px-3 py-2.5 text-[11px] ${
                      showDetails ? "text-ink" : "text-muted"
                    }`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`space-y-2.5 rounded-xl p-0.5 transition ${ring(
                sceneId === "schedule"
              )}`}
            >
              <div>
                <span className={labelClass}>Area</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {AREAS.map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-xl border py-2 text-center text-[10px] font-semibold ${
                        showSchedule && a.id === DEMO.area
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-line text-ink-soft"
                      }`}
                    >
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className={labelClass}>Preferred date</span>
                  <div className="rounded-2xl border border-line bg-canvas/70 px-2.5 py-2.5 text-[10px] text-ink">
                    {showSchedule ? DEMO.date : "Select date"}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>Preferred time</span>
                  <div className="rounded-2xl border border-line bg-canvas/70 px-2.5 py-2.5 text-[10px] text-ink">
                    {showSchedule ? DEMO.time : "Select time"}
                  </div>
                </div>
              </div>
              {showSchedule ? (
                <div className="flex flex-wrap gap-1">
                  {BOOKING_TIME_SLOTS.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className={`rounded-lg px-2 py-1 text-[9px] ${
                        t === DEMO.time
                          ? "bg-accent font-semibold text-accent-fg"
                          : "bg-canvas-alt text-muted"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <span className={labelClass}>Notes (optional)</span>
              <div className="rounded-2xl border border-line bg-canvas/70 px-3 py-3 text-[10px] text-muted">
                Occasion, allergies, inspiration…
              </div>
            </div>

            <div
              className={`rounded-full py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-fg shadow-lift transition ${ring(
                sceneId === "send"
              )} ${sending ? "bg-accent-strong" : "bg-accent"}`}
            >
              {sending ? "Sending…" : "Send now"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function BookingGuideVideo({ siteName }: { siteName: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduce);

  useEffect(() => {
    if (!playing || reduce) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_MS);
    return () => window.clearInterval(t);
  }, [playing, reduce]);

  const scene = SCENES[index];
  const progress = ((index + 1) / SCENES.length) * 100;

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-14">
      <div className="relative mx-auto w-full max-w-[300px]">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-accent/15 via-gilt/10 to-transparent blur-2xl"
          aria-hidden
        />

        <div
          className="relative rounded-[2.35rem] bg-gradient-to-b from-[#2a2a2e] via-[#1a1a1c] to-[#0c0c0e] p-[10px] shadow-[0_40px_80px_-28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]"
          role="region"
          aria-label="How to fill the booking form on mobile"
        >
          {/* Side buttons */}
          <span
            className="absolute -left-[2px] top-[96px] h-7 w-[3px] rounded-l-sm bg-[#3a3a3e]"
            aria-hidden
          />
          <span
            className="absolute -left-[2px] top-[136px] h-12 w-[3px] rounded-l-sm bg-[#3a3a3e]"
            aria-hidden
          />
          <span
            className="absolute -left-[2px] top-[196px] h-12 w-[3px] rounded-l-sm bg-[#3a3a3e]"
            aria-hidden
          />
          <span
            className="absolute -right-[2px] top-[150px] h-16 w-[3px] rounded-r-sm bg-[#3a3a3e]"
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-[1.9rem] bg-canvas">
            <StatusBar />
            <BrowserChrome />

            <div className="relative h-[460px] overflow-hidden sm:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id === "done" ? "done" : "form"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <MiniBookingForm sceneId={scene.id} scrollY={scene.scroll} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center bg-canvas pb-2 pt-1">
              <span className="h-1 w-24 rounded-full bg-ink/25" aria-hidden />
            </div>
          </div>
        </div>

        {/* Player controls under phone */}
        <div className="relative z-10 mx-auto mt-5 max-w-[260px] rounded-2xl border border-line bg-surface/95 px-3 py-3 shadow-soft backdrop-blur-sm">
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-fg shadow-lift transition hover:bg-accent-strong"
              aria-label={playing ? "Pause guide" : "Play guide"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                  <path d="M7 5h3v14H7V5zm7 0h3v14h-3V5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>
            <p className="min-w-0 flex-1 truncate text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {scene.label} · {index + 1}/{SCENES.length}
            </p>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setIndex((i) => (i + 1) % SCENES.length);
              }}
              className="rounded-full border border-line px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent transition hover:border-accent/40"
            >
              Next
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-muted">
          {siteName} · live /book form preview
        </p>
      </div>

      <div className="px-1">
        <p className="eyebrow">Watch & learn</p>
        <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink sm:text-4xl">
          How to fill the form
        </h2>
        <div
          className="mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
          aria-hidden
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            <p className="font-display text-2xl text-ink sm:text-3xl">
              {scene.title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
              {scene.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {SCENES.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setPlaying(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                  i === index
                    ? "border-accent/40 bg-accent-soft"
                    : "border-line bg-surface hover:border-accent/25"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    i === index
                      ? "bg-accent text-accent-fg"
                      : "bg-canvas-alt text-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-medium text-ink">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <Link
          href="/book"
          className="btn-primary mt-6 inline-flex w-full sm:w-auto"
        >
          Open real form
        </Link>
      </div>
    </div>
  );
}
