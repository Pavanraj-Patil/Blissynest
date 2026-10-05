"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

type Preview = { key: string; label: string; subject: string; html: string };

export function EmailPreviews({
  previews,
  canSend,
  adminEmail,
}: {
  previews: Preview[];
  canSend: boolean;
  adminEmail: string;
}) {
  const [active, setActive] = useState(previews[0].key);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const current = previews.find((p) => p.key === active) ?? previews[0];

  async function sendTest() {
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: active }),
      });
      const data = await res.json().catch(() => ({}));
      setMessage(
        res.ok
          ? { ok: true, text: `Test sent to ${data.to}. Check your inbox and spam folder.` }
          : { ok: false, text: data.error ?? "Could not send the test." }
      );
    } catch {
      setMessage({ ok: false, text: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr]">
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {previews.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => {
              setActive(p.key);
              setMessage(null);
            }}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
              p.key === active
                ? "border-olive bg-olive text-cream"
                : "border-charcoal/10 bg-white text-charcoal hover:bg-cream-dark"
            )}
          >
            {p.label}
          </button>
        ))}
      </nav>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-charcoal/10 bg-white p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Subject</p>
            <p className="truncate text-sm text-charcoal">{current.subject}</p>
          </div>
          <button
            type="button"
            onClick={sendTest}
            disabled={sending || !canSend}
            title={canSend ? `Sends to ${adminEmail}` : "Email sending is not set up yet"}
            className="inline-flex items-center gap-2 rounded-lg bg-olive px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-cream transition-colors hover:bg-olive-dark disabled:opacity-50"
          >
            <Send size={14} />
            {sending ? "Sending…" : "Send test to me"}
          </button>
        </div>
        {message && (
          <p className={cn("rounded-lg px-3 py-2 text-xs", message.ok ? "bg-olive/10 text-olive-dark" : "bg-terracotta/10 text-terracotta-dark")}>
            {message.text}
          </p>
        )}
        {!canSend && (
          <p className="rounded-lg bg-cream-dark px-3 py-2 text-xs text-charcoal-light">
            Sending is not set up on this server, so the test button is off. Previews still work.
          </p>
        )}
        <iframe
          title={current.label}
          srcDoc={current.html}
          className="h-[820px] w-full rounded-2xl border border-charcoal/10 bg-white"
        />
      </div>
    </div>
  );
}
