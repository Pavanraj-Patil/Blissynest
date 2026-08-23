"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const notificationDefaults = [
  { key: "orders", label: "Order updates", hint: "Shipping and delivery notifications", checked: true },
  { key: "promos", label: "Promotions & offers", hint: "Sales, coupons, and seasonal edits", checked: true },
  { key: "recs", label: "Product recommendations", hint: "Gift ideas picked for you", checked: false },
];

export function SettingsSection() {
  const [notifications, setNotifications] = useState(notificationDefaults);

  function toggle(key: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.key === key ? { ...n, checked: !n.checked } : n))
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
        <h2 className="font-serif text-lg text-charcoal">Change password</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mt-5 space-y-4 max-w-md">
          <label className="block">
            <span className="text-xs font-medium text-charcoal">Current Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-charcoal">New Password</span>
            <input
              type="password"
              placeholder="••••••••"
              minLength={8}
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
        <h2 className="font-serif text-lg text-charcoal">Notifications</h2>
        <div className="mt-4 space-y-3.5">
          {notifications.map((n) => (
            <label key={n.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={n.checked}
                onChange={() => toggle(n.key)}
                className="mt-0.5 h-4 w-4 rounded border-charcoal/25 accent-olive"
              />
              <span>
                <span className="block text-sm text-charcoal">{n.label}</span>
                <span className="block text-xs text-ink-muted">{n.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 rounded-xl bg-cream-dark px-4 py-3.5 text-xs text-charcoal-light leading-relaxed">
        <Info size={15} className="text-terracotta shrink-0 mt-0.5" />
        <p>
          This is a demo profile — changes here update the page but aren&rsquo;t
          saved anywhere once you refresh.
        </p>
      </div>
    </div>
  );
}
