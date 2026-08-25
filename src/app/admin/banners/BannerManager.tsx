"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink, type LucideIcon } from "lucide-react";
import type { Banner } from "@/generated/prisma/client";
import { bannerIconOptions, bannerGradientOptions, bannerGradients, getBannerIcon } from "@/lib/banner-presets";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

// Takes the resolved icon component as a prop (rather than each caller
// computing `const Icon = getBannerIcon(key)` inline in their own render
// body) — same pattern as the dashboard's StatCard. Satisfies the
// react-hooks/static-components rule, which flags a capitalized local
// bound to a function call result and then rendered in the same scope.
function BannerPreviewCard({
  icon: Icon,
  gradientClasses,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  gradientClasses: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={`relative flex h-24 items-center overflow-hidden rounded-xl bg-gradient-to-br px-5 ${gradientClasses}`}>
      <Icon size={80} strokeWidth={1} className="absolute -right-3 -bottom-5 text-cream/10 rotate-[-12deg]" />
      <div className="relative">
        <p className="font-serif text-base text-cream">{title || "Banner title"}</p>
        <p className="mt-1 text-xs text-cream/80">{subtitle || "Banner subtitle"}</p>
      </div>
    </div>
  );
}

type BannerFormValues = {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  gradient: string;
  sortOrder: number;
  active: boolean;
};

const emptyForm: BannerFormValues = {
  title: "",
  subtitle: "",
  href: "/occasions/festivals",
  icon: bannerIconOptions[0],
  gradient: bannerGradientOptions[0],
  sortOrder: 0,
  active: true,
};

function BannerForm({
  initial,
  onSave,
  onCancel,
  submitting,
  error,
}: {
  initial: BannerFormValues;
  onSave: (values: BannerFormValues) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const [values, setValues] = useState(initial);

  function set<K extends keyof BannerFormValues>(key: K, value: BannerFormValues[K]) {
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
          <span className="text-xs font-medium text-charcoal">Title</span>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="The Diwali Edit"
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Link</span>
          <input
            required
            value={values.href}
            onChange={(e) => set("href", e.target.value)}
            placeholder="/occasions/festivals"
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-charcoal">Subtitle</span>
        <input
          required
          value={values.subtitle}
          onChange={(e) => set("subtitle", e.target.value)}
          placeholder="Diyas, sweets, and hampers for the festival of light."
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Icon</span>
          <select
            value={values.icon}
            onChange={(e) => set("icon", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          >
            {bannerIconOptions.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Gradient</span>
          <select
            value={values.gradient}
            onChange={(e) => set("gradient", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          >
            {bannerGradientOptions.map((key) => (
              <option key={key} value={key}>
                {bannerGradients[key].label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Sort Order</span>
          <input
            type="number"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4 rounded border-charcoal/25 accent-olive"
        />
        <span className="text-sm text-charcoal">Active — shown on the homepage</span>
      </label>

      <BannerPreviewCard
        icon={getBannerIcon(values.icon)}
        gradientClasses={bannerGradients[values.gradient].classes}
        title={values.title}
        subtitle={values.subtitle}
      />

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save Banner"}
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

export function BannerManager({ initial }: { initial: Banner[] }) {
  const [banners, setBanners] = useState(initial);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingBanner = banners.find((b) => b.id === editingId);
  const deletingBanner = banners.find((b) => b.id === deletingId);

  async function handleAdd(values: BannerFormValues) {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't save that banner.");
      return;
    }
    setBanners((prev) => [...prev, data.banner].sort((a, b) => a.sortOrder - b.sortOrder));
    setMode("list");
  }

  async function handleEdit(id: string, values: BannerFormValues) {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Couldn't update that banner.");
      return;
    }
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? data.banner : b)).sort((a, b) => a.sortOrder - b.sortOrder)
    );
    setMode("list");
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
  }

  async function handleToggleActive(id: string, active: boolean) {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active } : b)));
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
  }

  async function handleReorder(id: string, direction: -1 | 1) {
    const sorted = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = sorted.findIndex((b) => b.id === id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapIndex];
    const aOrder = b.sortOrder;
    const bOrder = a.sortOrder;

    setBanners((prev) =>
      prev.map((banner) => {
        if (banner.id === a.id) return { ...banner, sortOrder: aOrder };
        if (banner.id === b.id) return { ...banner, sortOrder: bOrder };
        return banner;
      })
    );

    await Promise.all([
      fetch(`/api/admin/banners/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, sortOrder: aOrder }),
      }),
      fetch(`/api/admin/banners/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, sortOrder: bOrder }),
      }),
    ]);
  }

  if (mode === "add") {
    return (
      <BannerForm
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

  if (mode === "edit" && editingBanner) {
    return (
      <BannerForm
        initial={editingBanner}
        onSave={(values) => handleEdit(editingBanner.id, values)}
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

  const sorted = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setMode("add")}
          className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
        >
          <Plus size={14} />
          Add Banner
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center text-sm text-ink-muted">
          No banners yet — the homepage carousel will stay hidden until you add one.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((banner, i) => {
            const Icon = getBannerIcon(banner.icon);
            return (
              <div key={banner.id} className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className={`relative flex h-16 w-28 shrink-0 items-center overflow-hidden rounded-xl bg-gradient-to-br px-3 ${bannerGradients[banner.gradient]?.classes ?? ""}`}
                  >
                    <Icon size={44} strokeWidth={1} className="absolute -right-1 -bottom-2 text-cream/10 rotate-[-12deg]" />
                    <p className="relative truncate text-[11px] font-serif text-cream">{banner.title}</p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal">{banner.title}</p>
                    <p className="truncate text-xs text-ink-muted">{banner.subtitle}</p>
                    <Link
                      href={banner.href}
                      target="_blank"
                      className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted hover:text-terracotta-dark w-fit"
                    >
                      {banner.href} <ExternalLink size={10} />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReorder(banner.id, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-dark disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(banner.id, 1)}
                      disabled={i === sorted.length - 1}
                      aria-label="Move down"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-dark disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.active}
                      onChange={(e) => handleToggleActive(banner.id, e.target.checked)}
                      className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                    />
                    <span className="text-xs text-charcoal-light">Active</span>
                  </label>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(banner.id);
                        setMode("edit");
                      }}
                      aria-label="Edit banner"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(banner.id)}
                      aria-label="Delete banner"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deletingBanner !== undefined}
        title="Delete this banner?"
        description={`"${deletingBanner?.title}" will be permanently deleted and disappear from the site immediately.`}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
