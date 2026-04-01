"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { site } from "@/lib/site";

export default function AdminLoginPage() {
  const router = useRouter();
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
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
      <motion.form
        onSubmit={onSubmit}
        className="glass-panel w-full max-w-md rounded-3xl p-8 md:p-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          {site.name}
        </p>
        <h1 className="mt-3 font-display text-3xl text-white">Admin login</h1>
        <label className="mt-8 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Username
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-gold/50"
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-gold/50"
            autoComplete="current-password"
            required
          />
        </label>
        {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </motion.form>
    </div>
  );
}
