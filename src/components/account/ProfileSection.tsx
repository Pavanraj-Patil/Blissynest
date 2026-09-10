"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { AccountUser } from "@/lib/account-data";

export function ProfileSection({ user }: { user: AccountUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't save your changes.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
      <h2 className="font-serif text-lg text-charcoal">Personal information</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Keep your details up to date for smoother checkouts.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md">
        {error && <p className="text-sm text-terracotta-dark">{error}</p>}

        <label className="block">
          <span className="text-xs font-medium text-charcoal">Full Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Phone</span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {saved ? (
            <>
              Saved
              <Check size={14} />
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
