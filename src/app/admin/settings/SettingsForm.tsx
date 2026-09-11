"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive";
const labelClass = "text-xs font-medium text-charcoal";

export function SettingsForm({
  initial,
}: {
  initial: {
    gstRatePercent: number;
    freeShippingThreshold: number;
    standardShippingFee: number;
    codEnabled: boolean;
  };
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't save settings.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-4">
      {error && <p className="text-sm text-terracotta-dark">{error}</p>}

      <label className="block">
        <span className={labelClass}>GST Rate (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={values.gstRatePercent}
          onChange={(e) => setValues((v) => ({ ...v, gstRatePercent: Number(e.target.value) }))}
          className={inputClass}
        />
        <span className="mt-1 block text-[11px] text-ink-muted">
          Applied to (subtotal − discount) at checkout. Product prices are already GST-inclusive,
          so this stays 0 unless your pricing model changes.
        </span>
      </label>

      <label className="block">
        <span className={labelClass}>Free Shipping Threshold (₹)</span>
        <input
          type="number"
          min={0}
          value={values.freeShippingThreshold}
          onChange={(e) => setValues((v) => ({ ...v, freeShippingThreshold: Number(e.target.value) }))}
          className={inputClass}
        />
        <span className="mt-1 block text-[11px] text-ink-muted">
          Orders at or above this subtotal ship free — also drives the header&rsquo;s free
          shipping banner text site-wide.
        </span>
      </label>

      <label className="block">
        <span className={labelClass}>Standard Shipping Fee (₹)</span>
        <input
          type="number"
          min={0}
          value={values.standardShippingFee}
          onChange={(e) => setValues((v) => ({ ...v, standardShippingFee: Number(e.target.value) }))}
          className={inputClass}
        />
      </label>

      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={values.codEnabled}
          onChange={(e) => setValues((v) => ({ ...v, codEnabled: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-charcoal/25 accent-olive"
        />
        <span>
          <span className="block text-sm text-charcoal">Enable Cash on Delivery</span>
          <span className="block text-[11px] text-ink-muted">
            Turns off COD as a checkout payment option store-wide. Individual
            products can also be excluded from COD from their own edit page.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
      >
        {saved && <Check size={14} />}
        {saving ? "Saving…" : saved ? "Saved" : "Save Settings"}
      </button>
    </form>
  );
}
