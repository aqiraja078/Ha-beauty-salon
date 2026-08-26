"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ConsoleCrest } from "@/components/admin/icons";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { site } from "@/lib/site";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Login failed");
      }
      // Hard navigation so the session cookie is always picked up (more reliable
      // than client router.push on mobile / slow devices).
      window.location.assign("/admin");
      return;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <ThemeScope
      scope="admin"
      className="flex min-h-screen items-center justify-center overflow-hidden px-5 py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(var(--accent)/0.14),transparent)]"
        aria-hidden
      />

      <motion.form
        onSubmit={onSubmit}
        className="console-card relative z-10 w-full max-w-md p-8 text-center md:p-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <ConsoleCrest
          letter={site.name.charAt(0)}
          className="mx-auto h-20 w-20 text-accent"
        />
        <p className="mt-4 font-display text-sm uppercase tracking-[0.16em] text-ink">
          {site.name}
        </p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted">
          Staff console
        </p>

        <h1 className="mt-7 font-display text-3xl leading-tight text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Bookings dashboard tak pohanchne ke liye login karein.
        </p>

        <label className="mt-8 block text-left">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Username
          </span>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="console-field"
            autoComplete="username"
            required
          />
        </label>

        <label className="mt-4 block text-left">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Password
          </span>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="console-field"
            autoComplete="current-password"
            required
          />
        </label>

        {err && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700"
          >
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="console-btn mt-7 min-h-[46px] w-full text-sm"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          Authorised staff only. This area is not indexed.
        </p>
      </motion.form>
    </ThemeScope>
  );
}
