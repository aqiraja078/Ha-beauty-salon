"use client";

import { useState } from "react";

type Props = {
  phoneDigits: string;
  siteName: string;
};

const field =
  "w-full rounded-2xl border border-line bg-canvas/60 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent/60 focus:bg-surface focus:ring-4 focus:ring-accent/10";

export function ContactMessageForm({ phoneDigits, siteName }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      `*Contact message — ${siteName}*`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      ``,
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-soft sm:p-8">
        <p className="font-display text-2xl text-ink">Message ready</p>
        <p className="mt-2 text-sm text-ink-soft">
          WhatsApp opened with your details — send the chat to reach the salon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setMessage("");
          }}
          className="btn-ghost mt-5 inline-flex"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8"
    >
      <p className="eyebrow">Send a message</p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
        Tell us what you need
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Fill the form — we open WhatsApp with your message so the team can reply
        quickly.
      </p>

      <div className="mt-6 space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Name *
          </span>
          <input
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Phone / WhatsApp *
          </span>
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="03XX XXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Message *
          </span>
          <textarea
            required
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${field} resize-none`}
            placeholder="Service, preferred date, area…"
          />
        </label>
      </div>

      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto sm:px-10">
        Send on WhatsApp
      </button>
    </form>
  );
}
