"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p className={`flex items-center gap-2 text-sm text-olive-dark ${className ?? ""}`}>
        <Check size={16} />
        You&rsquo;re subscribed, thanks for joining!
      </p>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 min-w-0 rounded-full border border-charcoal/20 bg-white px-5 py-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0 disabled:opacity-60"
        >
          {status === "submitting" ? "…" : "Subscribe"}
          {status !== "submitting" && <ArrowRight size={14} />}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-terracotta-dark">{error}</p>}
    </div>
  );
}
