"use client";

import { PasswordInput } from "@/components/ui/PasswordInput";
import { useState } from "react";
import { Info, Check } from "lucide-react";

type NotificationPrefs = { orders: boolean; promos: boolean; recs: boolean };
type NotificationKey = keyof NotificationPrefs;

const notificationCopy: { key: NotificationKey; label: string; hint: string }[] = [
  { key: "orders", label: "Order updates", hint: "Shipping and delivery notifications" },
  { key: "promos", label: "Promotions & offers", hint: "Sales, coupons, and seasonal edits" },
  { key: "recs", label: "Product recommendations", hint: "Gift ideas picked for you" },
];

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Your new password can't be the same as your current password.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't update your password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-md">
      {error && <p className="text-sm text-terracotta-dark">{error}</p>}
      <label className="block">
        <span className="text-xs font-medium text-charcoal">Current Password</span>
        <PasswordInput
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-charcoal">New Password</span>
        <PasswordInput
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-charcoal">Confirm New Password</span>
        <PasswordInput
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
      >
        {saved ? (
          <>
            Updated
            <Check size={14} />
          </>
        ) : saving ? (
          "Updating…"
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}

export function SettingsSection({
  hasPassword,
  initialNotifications,
}: {
  hasPassword: boolean;
  initialNotifications: NotificationPrefs;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notifError, setNotifError] = useState<string | null>(null);

  async function toggle(key: NotificationKey) {
    setNotifError(null);
    const previous = notifications;
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);

    const res = await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      setNotifications(previous);
      setNotifError("Couldn't save that preference. Please try again.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
        <h2 className="font-serif text-lg text-charcoal">Change password</h2>
        {hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <div className="mt-4 flex gap-2.5 rounded-xl bg-cream-dark px-4 py-3.5 text-sm text-charcoal-light leading-relaxed">
            <Info size={15} className="text-terracotta shrink-0 mt-0.5" />
            <p>
              You signed in with Google, so there&rsquo;s no Blissynest
              password to change here — manage your sign-in from your Google
              account instead.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7">
        <h2 className="font-serif text-lg text-charcoal">Notifications</h2>
        {notifError && <p className="mt-2 text-sm text-terracotta-dark">{notifError}</p>}
        <div className="mt-4 space-y-3.5">
          {notificationCopy.map((n) => (
            <label key={n.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[n.key]}
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
    </div>
  );
}
