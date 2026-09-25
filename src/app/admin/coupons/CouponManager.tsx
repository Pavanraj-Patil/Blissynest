"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/generated/prisma/client";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type CouponFormValues = {
  code: string;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  minOrderValue: number;
  usageLimit: number | "";
  active: boolean;
  firstOrderOnly: boolean;
  expiresAt: string; // YYYY-MM-DD or ""
};

const emptyForm: CouponFormValues = {
  code: "",
  discountType: "PERCENT",
  discountValue: 10,
  minOrderValue: 0,
  usageLimit: "",
  active: true,
  firstOrderOnly: false,
  expiresAt: "",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";
const labelClass = "text-xs font-medium text-charcoal";

function toFormValues(c: Coupon): CouponFormValues {
  return {
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountType === "FLAT" ? Math.round(c.discountValue / 100) : c.discountValue,
    minOrderValue: Math.round(c.minOrderValue / 100),
    usageLimit: c.usageLimit ?? "",
    active: c.active,
    firstOrderOnly: c.firstOrderOnly,
    expiresAt: c.expiresAt ? new Date(c.expiresAt.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10) : "",
  };
}

function CouponForm({
  initial,
  onSave,
  onCancel,
  submitting,
  error,
}: {
  initial: CouponFormValues;
  onSave: (values: CouponFormValues) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const [values, setValues] = useState(initial);

  function set<K extends keyof CouponFormValues>(key: K, value: CouponFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
      }}
      className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-4"
    >
      {error && <p className="text-sm text-terracotta-dark">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelClass}>Code</span>
          <input
            required
            value={values.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            placeholder="WELCOME10"
            className={`${inputClass} uppercase`}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Discount Type</span>
          <select
            value={values.discountType}
            onChange={(e) => set("discountType", e.target.value as "PERCENT" | "FLAT")}
            className={inputClass}
          >
            <option value="PERCENT">Percent off</option>
            <option value="FLAT">Flat amount off (₹)</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className={labelClass}>{values.discountType === "PERCENT" ? "Percent (%)" : "Amount (₹)"}</span>
          <input
            required
            type="number"
            min={0}
            max={values.discountType === "PERCENT" ? 100 : undefined}
            value={values.discountValue}
            onChange={(e) => set("discountValue", Number(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Min Order Value (₹)</span>
          <input
            type="number"
            min={0}
            value={values.minOrderValue}
            onChange={(e) => set("minOrderValue", Number(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Usage Limit (optional)</span>
          <input
            type="number"
            min={0}
            value={values.usageLimit}
            onChange={(e) => set("usageLimit", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Unlimited"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block max-w-xs">
        <span className={labelClass}>Expires on (optional)</span>
        <input
          type="date"
          value={values.expiresAt}
          onChange={(e) => set("expiresAt", e.target.value)}
          className={inputClass}
        />
        <span className="mt-1 block text-[11px] text-ink-muted">Works through the end of this day. Leave empty for no expiry.</span>
      </label>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4 rounded border-charcoal/25 accent-olive"
        />
        <span className="text-sm text-charcoal">Active — customers can apply this at checkout</span>
      </label>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={values.firstOrderOnly}
          onChange={(e) => set("firstOrderOnly", e.target.checked)}
          className="h-4 w-4 rounded border-charcoal/25 accent-olive"
        />
        <span className="text-sm text-charcoal">
          First-time customers only — blocked for anyone with a prior order
        </span>
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save Coupon"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-charcoal/20 px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function CouponManager({ initial }: { initial: Coupon[] }) {
  // Fixed at mount so the "Expired" badge is stable across re-renders.
  const [now] = useState(() => Date.now());
  const [coupons, setCoupons] = useState(initial);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const editingCoupon = coupons.find((c) => c.id === editingId);
  const deletingCoupon = coupons.find((c) => c.id === deletingId);

  async function handleAdd(values: CouponFormValues) {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, usageLimit: values.usageLimit === "" ? undefined : values.usageLimit }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't save that coupon.");
      return;
    }
    setCoupons((prev) => [data.coupon, ...prev]);
    setMode("list");
  }

  async function handleEdit(id: string, values: CouponFormValues) {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, usageLimit: values.usageLimit === "" ? undefined : values.usageLimit }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't update that coupon.");
      return;
    }
    setCoupons((prev) => prev.map((c) => (c.id === id ? data.coupon : c)));
    setMode("list");
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (deleting) return;
    setDeleting(true);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleting(false);
    setDeletingId(null);
  }

  async function handleToggleActive(id: string, active: boolean) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
  }

  if (mode === "add") {
    return (
      <CouponForm
        initial={emptyForm}
        onSave={handleAdd}
        onCancel={() => {
          setMode("list");
          setError(null);
        }}
        submitting={submitting}
        error={error}
      />
    );
  }

  if (mode === "edit" && editingCoupon) {
    return (
      <CouponForm
        initial={toFormValues(editingCoupon)}
        onSave={(values) => handleEdit(editingCoupon.id, values)}
        onCancel={() => {
          setMode("list");
          setEditingId(null);
          setError(null);
        }}
        submitting={submitting}
        error={error}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setMode("add")}
          className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
        >
          <Plus size={14} />
          Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center text-sm text-ink-muted">
          No coupons yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                <th className="py-3 pl-5 pr-3 font-medium">Code</th>
                <th className="py-3 px-3 font-medium">Discount</th>
                <th className="py-3 px-3 font-medium">Min Order</th>
                <th className="py-3 px-3 font-medium">Used</th>
                <th className="py-3 px-3 font-medium">Expires</th>
                <th className="py-3 px-3 font-medium">Active</th>
                <th className="py-3 pr-5 pl-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-charcoal/5 last:border-0">
                  <td className="py-2.5 pl-5 pr-3 font-medium text-charcoal">
                    {c.code}
                    {c.firstOrderOnly && (
                      <span className="ml-2 rounded-full bg-terracotta/10 text-terracotta-dark text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
                        First order
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal-light">
                    {c.discountType === "PERCENT" ? `${c.discountValue}%` : `₹${Math.round(c.discountValue / 100)}`}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal-light">
                    {c.minOrderValue > 0 ? `₹${Math.round(c.minOrderValue / 100).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal-light">
                    {c.usedCount}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal-light">
                    {c.expiresAt ? (
                      new Date(c.expiresAt).getTime() < now ? (
                        <span className="rounded-full bg-charcoal/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-charcoal-light">Expired</span>
                      ) : (
                        new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c.active}
                        onChange={(e) => handleToggleActive(c.id, e.target.checked)}
                        className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                      />
                    </label>
                  </td>
                  <td className="py-2.5 pr-5 pl-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(c.id);
                          setMode("edit");
                        }}
                        aria-label="Edit coupon"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(c.id)}
                        aria-label="Delete coupon"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deletingCoupon !== undefined}
        title="Delete this coupon?"
        description={`Code "${deletingCoupon?.code}" will be permanently deleted and stop working immediately, including for anyone who already has it saved.`}
        submitting={deleting}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
