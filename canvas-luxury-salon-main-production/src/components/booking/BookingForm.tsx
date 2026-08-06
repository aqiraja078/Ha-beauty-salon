"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BOOKING_FIELD_LIMITS,
  emailValidationMessage,
  formatPhoneDisplay,
  isValidBookingEmail,
  isValidPhone,
  phoneValidationMessage,
  PHONE_DIGIT_MAX,
} from "@/lib/booking-validation";
import {
  estimateDurationMinutes,
  travelMinutesForArea,
} from "@/lib/booking-estimates";
import { BOOKING_TIME_SLOTS } from "@/lib/booking-slots";
import {
  BOOKING_AREAS,
  type BookingArea,
  type BookingMode,
} from "@/lib/bookings-types";
import { bookingWhatsAppUrl } from "@/lib/booking-whatsapp";
import { formatFromPrice, sumServicePrices } from "@/lib/format-price";
import { resolveBookingService } from "@/lib/booking-prefill";

type FormProps = {
  defaultService?: string;
  defaultPrice?: string;
  defaultMode?: BookingMode;
  services?: string[];
  servicePrices?: Record<string, string>;
  bridalServices?: {
    mehndi: string[];
    makeup: string[];
    hair: string[];
  };
  siteName?: string;
  phoneDigits?: string;
};

const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((ev: {
        resultIndex: number;
        results: {
          length: number;
          [index: number]: { isFinal: boolean; [i: number]: { transcript: string } };
        };
      }) => void)
    | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function voiceSecureOk(): boolean {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export function BookingForm({
  defaultService,
  defaultPrice,
  defaultMode,
  services,
  servicePrices = {},
  siteName = "HA Beauty Salon",
  phoneDigits = "923355462214",
}: FormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<BookingMode>(
    defaultMode ?? (defaultService ? "single" : "single")
  );
  const [serviceVal, setServiceVal] = useState(defaultService ?? "");
  const [bridalPicks, setBridalPicks] = useState<string[]>([]);
  const [area, setArea] = useState<BookingArea | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [dateBlocked, setDateBlocked] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceHint, setVoiceHint] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const bookingServices = services?.length
    ? services
    : Object.keys(servicePrices).length
      ? Object.keys(servicePrices)
      : [];

  const serviceOptions = useMemo(() => {
    const list = [...bookingServices];
    const resolved = resolveBookingService(defaultService, list);
    if (resolved && !list.includes(resolved)) {
      list.unshift(resolved);
    }
    if (defaultService && !list.includes(defaultService)) {
      list.unshift(defaultService);
    }
    return list;
  }, [bookingServices, defaultService]);

  const prefilledService = useMemo(
    () => resolveBookingService(defaultService, serviceOptions),
    [defaultService, serviceOptions]
  );

  const selectedServices = useMemo(() => {
    if (mode === "bridal") return bridalPicks;
    return serviceVal ? [serviceVal] : [];
  }, [mode, bridalPicks, serviceVal]);

  const serviceLabel =
    mode === "bridal"
      ? `Multi service: ${selectedServices.join(" + ")}`
      : selectedServices[0] || "";

  const durationMinutes = estimateDurationMinutes(selectedServices, mode);
  const travelMinutes = area ? travelMinutesForArea(area) : 0;

  const selectedPrice = useMemo(() => {
    if (mode === "bridal") {
      if (!bridalPicks.length) return null;
      return sumServicePrices(bridalPicks, servicePrices).labeled;
    }
    if (!serviceVal) return null;
    const fromQuery =
      defaultPrice &&
      (serviceVal === defaultService || serviceVal === prefilledService)
        ? defaultPrice
        : undefined;
    const raw = fromQuery || servicePrices[serviceVal];
    return raw ? formatFromPrice(raw) : null;
  }, [
    mode,
    bridalPicks,
    serviceVal,
    defaultService,
    defaultPrice,
    servicePrices,
    prefilledService,
  ]);

  const priceForSubmit =
    mode === "bridal"
      ? bridalPicks.length
        ? sumServicePrices(bridalPicks, servicePrices).labeled
        : undefined
      : serviceVal
        ? defaultPrice &&
          (serviceVal === defaultService || serviceVal === prefilledService)
          ? defaultPrice
          : servicePrices[serviceVal]
        : undefined;

  const minDate = new Date().toISOString().split("T")[0];

  const searchResults = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    if (!q) return [];
    return serviceOptions
      .filter((s) => s.toLowerCase().includes(q))
      .filter((s) => {
        if (replaceIndex != null) {
          return !bridalPicks.some((p, i) => i !== replaceIndex && p === s);
        }
        return !bridalPicks.includes(s);
      })
      .slice(0, 8);
  }, [serviceQuery, serviceOptions, bridalPicks, replaceIndex]);

  useEffect(() => {
    setVoiceSupported(Boolean(getSpeechRecognition()) && voiceSecureOk());
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (defaultMode === "bridal") {
      setMode("bridal");
      return;
    }
    if (defaultService) {
      setMode("single");
      const resolved = resolveBookingService(defaultService, [
        ...bookingServices,
        defaultService,
      ]);
      if (resolved) setServiceVal(resolved);
    }
  }, [defaultMode, defaultService, bookingServices]);

  useEffect(() => {
    if (!date) {
      setTaken([]);
      setDateBlocked(false);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`)
      .then(async (res) => {
        const data = (await res.json()) as {
          taken?: string[];
          blocked?: boolean;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Could not load slots");
        if (!cancelled) {
          const nextTaken = data.taken ?? [];
          setTaken(nextTaken);
          setDateBlocked(Boolean(data.blocked));
          setTime((prev) => (prev && nextTaken.includes(prev) ? "" : prev));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTaken([]);
          setDateBlocked(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const addOrReplaceService = useCallback(
    (item: string) => {
      setBridalPicks((prev) => {
        if (replaceIndex != null) {
          const next = [...prev];
          next[replaceIndex] = item;
          return Array.from(new Set(next));
        }
        if (prev.includes(item)) return prev;
        return [...prev, item];
      });
      setReplaceIndex(null);
      setServiceQuery("");
    },
    [replaceIndex]
  );

  const removeService = useCallback((item: string) => {
    setBridalPicks((prev) => prev.filter((x) => x !== item));
    setReplaceIndex(null);
  }, []);

  const stopVoiceSearch = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  }, []);

  const startVoiceSearch = useCallback(async () => {
    setVoiceHint("");

    if (listening) {
      stopVoiceSearch();
      return;
    }

    if (!voiceSecureOk()) {
      setVoiceHint(
        "Mic needs a secure page. Open the site on http://localhost:3000 (not a phone IP like 192.168.x.x)."
      );
      return;
    }

    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setVoiceHint(
        "Voice search needs Chrome or Edge. Type the service name in the search box instead."
      );
      return;
    }

    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }

    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setVoiceHint("Listening… say a service name (e.g. bridal makeup)");
    };

    recognition.onresult = (ev) => {
      let transcript = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        transcript += ev.results[i][0]?.transcript ?? "";
      }
      const cleaned = transcript.trim();
      if (cleaned) {
        setServiceQuery(cleaned);
        if (ev.results[ev.results.length - 1]?.isFinal) {
          setVoiceHint(`Heard: “${cleaned}”`);
        }
      }
    };

    recognition.onerror = (ev) => {
      setListening(false);
      const code = ev.error || "unknown";
      if (code === "not-allowed" || code === "service-not-allowed") {
        setVoiceHint(
          "Microphone blocked. Click the lock/tune icon near the URL → Site settings → Microphone → Allow, then refresh."
        );
      } else if (code === "no-speech") {
        setVoiceHint("No speech heard. Tap the mic and speak clearly.");
      } else if (code === "network") {
        setVoiceHint(
          "Voice service needs internet. Check connection and try again."
        );
      } else if (code === "aborted") {
        setVoiceHint("");
      } else {
        setVoiceHint(`Voice error: ${code}. Try typing instead.`);
      }
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceHint("Could not start mic. Wait a second and tap again.");
    }
  }, [listening, stopVoiceSearch]);

  const waPayload = useMemo(
    () =>
      area
        ? {
            name,
            phone,
            email,
            area,
            services: selectedServices,
            serviceLabel,
            date,
            time,
            durationMinutes,
            travelMinutes: travelMinutesForArea(area),
            bookingMode: mode,
            message: message || undefined,
            priceLabel: selectedPrice || undefined,
          }
        : null,
    [
      area,
      name,
      phone,
      email,
      selectedServices,
      serviceLabel,
      date,
      time,
      durationMinutes,
      mode,
      message,
      selectedPrice,
    ]
  );

  function isValid(): boolean {
    if (!name.trim()) return false;
    if (!isValidBookingEmail(email)) return false;
    if (!isValidPhone(phone)) return false;
    if (!area || !date || !time || dateBlocked) return false;
    if (mode === "single") return Boolean(serviceVal);
    return bridalPicks.length >= 2;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextEmailErr = emailValidationMessage(email);
    const nextPhoneErr = phoneValidationMessage(phone);
    setEmailError(nextEmailErr);
    setPhoneError(nextPhoneErr);

    if (nextEmailErr || nextPhoneErr) {
      setStatus("err");
      setMsg(nextEmailErr || nextPhoneErr || "Please fix email and phone.");
      return;
    }

    if (dateBlocked) {
      setStatus("err");
      setMsg("That date is not available. Please choose another day.");
      return;
    }

    if (!area || !waPayload || !isValid()) {
      setStatus("err");
      setMsg(
        mode === "bridal" && bridalPicks.length < 2
          ? "Multi service needs at least two services."
          : "Please fill all required fields."
      );
      return;
    }

    const formattedPhone = formatPhoneDisplay(phone);
    const normalizedEmail = email.trim().toLowerCase();
    setPhone(formattedPhone);
    setEmail(normalizedEmail);
    setStatus("loading");
    setMsg("");

    const submitPayload = {
      name,
      phone: formattedPhone,
      email: normalizedEmail,
      area,
      services: selectedServices,
      serviceLabel,
      date,
      time,
      durationMinutes,
      travelMinutes: travelMinutesForArea(area),
      bookingMode: mode,
      message: message || undefined,
      priceLabel: selectedPrice || undefined,
    };

    const waHref = bookingWhatsAppUrl(submitPayload, {
      name: siteName,
      phoneDigits,
    });
    const waWindow = window.open("about:blank", "_blank");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          phone: formattedPhone,
          service: serviceLabel,
          services: selectedServices,
          bookingMode: mode,
          area,
          date,
          time,
          message: message || undefined,
          price: priceForSubmit,
          durationMinutes,
          travelMinutes: travelMinutesForArea(area),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waHref;
      } else {
        window.open(waHref, "_blank", "noopener,noreferrer");
      }

      // After admin + WhatsApp, go home
      router.push("/");
      router.refresh();
    } catch (err) {
      if (waWindow && !waWindow.closed) waWindow.close();
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      if (err instanceof Error && /already booked/i.test(err.message)) {
        setTime("");
        if (date) {
          fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`)
            .then((r) => r.json())
            .then((d: { taken?: string[]; blocked?: boolean }) => {
              setTaken(d.taken ?? []);
              setDateBlocked(Boolean(d.blocked));
            })
            .catch(() => {});
        }
      }
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl rounded-[1.5rem] border border-line bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-6 md:p-7"
      aria-busy={status === "loading"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="eyebrow">Appointment details</p>
      <h2 className="mt-1.5 font-display text-xl text-ink sm:text-2xl">
        Book your home visit
      </h2>
      <div
        className="mt-2.5 h-[3px] w-12 rounded-full bg-gradient-to-r from-accent to-tint"
        aria-hidden
      />
      <p className="mt-2 text-sm text-ink-soft">
        Complete the details below, then tap Send now.
      </p>

      <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
        {/* Prefill notice */}
        {prefilledService && mode === "single" ? (
          <div className="rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Selected service
            </p>
            <p className="mt-1 font-medium text-ink">{prefilledService}</p>
            {selectedPrice ? (
              <p className="mt-1 font-semibold text-accent">{selectedPrice}</p>
            ) : null}
          </div>
        ) : null}

        {/* Mode — hide when user already picked a service from another page */}
        {!prefilledService ? (
          <div>
            <span className={labelClass}>Booking type</span>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "single" as const, title: "Single service" },
                  { id: "bridal" as const, title: "Multi service" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMode(opt.id);
                    if (opt.id === "single") setBridalPicks([]);
                    else setServiceVal("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                    mode === opt.id
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line text-ink-soft hover:border-accent/35"
                  }`}
                >
                  {opt.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Service — hide dropdown when already prefilled (shown above) */}
        {mode === "single" ? (
          !prefilledService ? (
          <div>
            <label className="block">
              <span className={labelClass}>Service</span>
              <select
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
          ) : null
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ink-soft">
              Search or speak to add at least two services.
            </p>

            <div>
              <span className={labelClass}>
                {replaceIndex != null
                  ? `Replace service #${replaceIndex + 1}`
                  : "Search services"}
              </span>
              <div className="flex gap-2">
                <input
                  type="search"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  className="field flex-1"
                  placeholder="Type service name…"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => {
                    void startVoiceSearch();
                  }}
                  title={
                    listening
                      ? "Stop listening"
                      : voiceSupported
                        ? "Speak to search"
                        : "Tap for mic help"
                  }
                  aria-label={listening ? "Stop voice search" : "Speak to search"}
                  aria-pressed={listening}
                  className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition ${
                    listening
                      ? "animate-pulse border-accent bg-accent text-accent-fg"
                      : "border-line bg-surface text-ink-soft hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden
                  >
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                  </svg>
                </button>
              </div>
              {voiceHint ? (
                <p
                  className={`mt-2 text-xs font-medium ${
                    listening ? "text-accent" : "text-ink-soft"
                  }`}
                >
                  {voiceHint}
                </p>
              ) : null}

              <AnimatePresence>
                {serviceQuery.trim() ? (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-line bg-surface shadow-soft"
                  >
                    {searchResults.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-muted">
                        No services match “{serviceQuery.trim()}”
                      </li>
                    ) : (
                      searchResults.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => addOrReplaceService(item)}
                            className="flex w-full items-center justify-between gap-3 border-b border-line/70 px-4 py-3 text-left text-sm last:border-0 hover:bg-accent-soft"
                          >
                            <span className="text-ink">{item}</span>
                            <span className="shrink-0 text-xs font-semibold text-accent">
                              {formatFromPrice(servicePrices[item])}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </div>

            {bridalPicks.length > 0 ? (
              <div className="rounded-2xl border border-line bg-canvas-alt/70 p-4">
                <p className={labelClass}>Selected services</p>
                <ul className="mt-1 space-y-2">
                  {bridalPicks.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {item}
                        </p>
                        <p className="text-xs font-semibold text-accent">
                          {formatFromPrice(servicePrices[item])}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setReplaceIndex(idx);
                            setServiceQuery("");
                          }}
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                            replaceIndex === idx
                              ? "border-accent bg-accent-soft text-accent"
                              : "border-line text-ink-soft hover:border-accent/40 hover:text-accent"
                          }`}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => removeService(item)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-600 transition hover:bg-rose-100"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {selectedPrice ? (
                  <p className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-accent/25 bg-accent-soft px-4 py-3 text-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Total estimate
                    </span>
                    <span className="font-semibold text-accent">
                      {selectedPrice}
                    </span>
                  </p>
                ) : null}

                {replaceIndex != null ? (
                  <button
                    type="button"
                    onClick={() => setReplaceIndex(null)}
                    className="mt-2 text-xs font-medium text-muted underline"
                  >
                    Cancel change
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="text-xs text-muted">
                No services selected yet — search above to add.
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Full name</span>
            <input
              required
              maxLength={BOOKING_FIELD_LIMITS.name}
              autoComplete="name"
              className="field"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Email</span>
            <input
              type="email"
              required
              inputMode="email"
              maxLength={BOOKING_FIELD_LIMITS.email}
              autoComplete="email"
              className={`field ${emailError ? "border-red-300 focus:border-red-400" : ""}`}
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(emailValidationMessage(e.target.value));
              }}
              onBlur={() => setEmailError(emailValidationMessage(email))}
              aria-invalid={Boolean(emailError)}
            />
            {emailError ? (
              <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
            ) : (
              <p className="mt-1.5 text-[11px] text-muted">
                Format: name@gmail.com
              </p>
            )}
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input
              type="tel"
              required
              inputMode="tel"
              maxLength={PHONE_DIGIT_MAX + 1}
              autoComplete="tel"
              className={`field ${phoneError ? "border-red-300 focus:border-red-400" : ""}`}
              placeholder="+923001234567"
              value={phone}
              onChange={(e) => {
                const next = formatPhoneDisplay(e.target.value);
                setPhone(next);
                if (phoneError) setPhoneError(phoneValidationMessage(next));
              }}
              onBlur={() => {
                const next = formatPhoneDisplay(phone);
                setPhone(next);
                setPhoneError(phoneValidationMessage(next));
              }}
              aria-invalid={Boolean(phoneError)}
            />
            {phoneError ? (
              <p className="mt-1.5 text-xs text-red-600">{phoneError}</p>
            ) : null}
          </label>
        </div>

        {/* Schedule */}
        <div>
          <span className={labelClass}>Area</span>
          <div className="grid grid-cols-3 gap-2">
            {BOOKING_AREAS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setArea(a.id)}
                className={`rounded-xl border px-2 py-3 text-center text-xs font-semibold transition sm:text-sm ${
                  area === a.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-ink-soft hover:border-accent/35"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <label className="block">
            <span className={labelClass}>Preferred date</span>
            <input
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="field"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Preferred time</span>
            <select
              required={!dateBlocked}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="field"
              disabled={!date || loadingSlots || dateBlocked}
            >
              <option value="" disabled>
                {loadingSlots
                  ? "Loading slots…"
                  : dateBlocked
                    ? "Date unavailable"
                    : date
                      ? "Select time"
                      : "Choose a date first"}
              </option>
              {BOOKING_TIME_SLOTS.map((t) => {
                const busy = taken.includes(t);
                return (
                  <option key={t} value={t} disabled={busy}>
                    {t}
                    {busy ? " — taken" : ""}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        {dateBlocked ? (
          <p
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            This date is fully booked / off — please choose another day.
          </p>
        ) : null}

        <label className="block">
          <span className={labelClass}>Notes (optional)</span>
          <textarea
            rows={3}
            maxLength={BOOKING_FIELD_LIMITS.message}
            className="field resize-none"
            placeholder="Occasion, allergies, inspiration..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </div>

      <AnimatePresence>
        {msg && status === "err" ? (
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
          >
            {msg}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send now"}
      </button>
    </motion.form>
  );
}
