"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive";
const labelClass = "text-xs font-medium text-charcoal";

// "2026-10-05T14:30:00.000Z" -> "2026-10-05T14:30", in the browser's own
// local time, for a <input type="datetime-local">. Saving reinterprets that
// same string as the server's local time — fine while admin and server are
// both on this laptop; worth a second look once they're not.
function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SettingsForm({
  initial,
}: {
  initial: {
    gstRatePercent: number;
    freeShippingThreshold: number;
    standardShippingFee: number;
    codEnabled: boolean;
    topBarEnabled: boolean;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    maintenanceReturnAt: string | null;
  };
}) {
  const [values, setValues] = useState({
    ...initial,
    maintenanceReturnAt: toLocalInputValue(initial.maintenanceReturnAt),
  });
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

      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={values.topBarEnabled}
          onChange={(e) => setValues((v) => ({ ...v, topBarEnabled: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-charcoal/25 accent-olive"
        />
        <span>
          <span className="block text-sm text-charcoal">Show Top Bar</span>
          <span className="block text-[11px] text-ink-muted">
            The free-shipping strip and Track Order/Help/Corporate Gifting
            links shown above the header on every page.
          </span>
        </span>
      </label>

      <div
        className={`rounded-xl border p-4 transition-colors ${
          values.maintenanceMode ? "border-terracotta/40 bg-terracotta/5" : "border-charcoal/15"
        }`}
      >
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={values.maintenanceMode}
            onChange={(e) => setValues((v) => ({ ...v, maintenanceMode: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-charcoal/25 accent-terracotta"
          />
          <span>
            <span className="block text-sm font-medium text-charcoal">
              Maintenance mode {values.maintenanceMode && <span className="text-terracotta-dark">— site is down for visitors</span>}
            </span>
            <span className="block text-[11px] text-ink-muted">
              Visitors see a &ldquo;we&rsquo;ll be right back&rdquo; page instead of the site.
              You and other admins can still sign in and manage everything from here.
            </span>
          </span>
        </label>

        {values.maintenanceMode && (
          <div className="mt-4 space-y-4 border-t border-terracotta/20 pt-4">
            <label className="block">
              <span className={labelClass}>Custom message (optional)</span>
              <textarea
                value={values.maintenanceMessage}
                onChange={(e) => setValues((v) => ({ ...v, maintenanceMessage: e.target.value }))}
                maxLength={500}
                rows={3}
                placeholder="We're making a few changes behind the scenes to make your gifting experience even better. We'll be back shortly."
                className={`${inputClass} resize-none`}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Expected back (optional)</span>
              <input
                type="datetime-local"
                value={values.maintenanceReturnAt}
                onChange={(e) => setValues((v) => ({ ...v, maintenanceReturnAt: e.target.value }))}
                className={inputClass}
              />
              <span className="mt-1 block text-[11px] text-ink-muted">
                Shows a live countdown on the maintenance page. Leave blank to skip it.
              </span>
            </label>
          </div>
        )}

        <Link
          href="/maintenance"
          target="_blank"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-terracotta-dark hover:text-terracotta"
        >
          Preview the maintenance page
          <ExternalLink size={11} />
        </Link>
      </div>

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
