"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const statusOptions = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatusOptions = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const selectClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";

export function OrderStatusEditor({
  orderId,
  initialStatus,
  initialPaymentStatus,
  initialTrackingNumber,
  initialCarrierName,
}: {
  orderId: string;
  initialStatus: string;
  initialPaymentStatus: string;
  initialTrackingNumber: string;
  initialCarrierName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [carrierName, setCarrierName] = useState(initialCarrierName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, trackingNumber, carrierName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't save changes.");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-4">
      <h2 className="font-serif text-lg text-charcoal">Fulfillment</h2>

      {error && <p className="text-sm text-terracotta-dark">{error}</p>}

      <label className="block">
        <span className="text-xs font-medium text-charcoal">Order Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-medium text-charcoal">Payment Status</span>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={selectClass}>
          {paymentStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Tracking Number</span>
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="—"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Carrier</span>
          <input
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            placeholder="—"
            className={inputClass}
          />
        </label>
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">
        The customer is emailed when you change the status to Shipped, Delivered or Cancelled. Cancelling puts the
        items back in stock; moving a cancelled order back takes them out again.
      </p>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
      >
        {saved && <Check size={14} />}
        {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
      </button>
    </div>
  );
}
