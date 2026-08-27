"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { RepeatingListField } from "@/components/admin/RepeatingListField";
import { NestedListField } from "@/components/admin/NestedListField";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import type { ResponsiveImageValue, SectionSchema } from "@/lib/content-schema";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";
const labelClass = "text-xs font-medium text-charcoal";

export function ContentSectionForm({
  page,
  section,
  schema,
  initial,
}: {
  page: string;
  section: string;
  schema: SectionSchema;
  initial: Record<string, unknown>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/content/${page}/${section}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't save changes.");
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {Object.entries(schema.fields).map(([key, descriptor]) => {
        const value = values[key];

        if (descriptor.type === "TEXT") {
          return (
            <label key={key} className="block">
              <span className={labelClass}>{descriptor.label}</span>
              <input
                value={typeof value === "string" ? value : ""}
                onChange={(e) => set(key, e.target.value)}
                className={inputClass}
              />
            </label>
          );
        }

        if (descriptor.type === "IMAGE") {
          const src = typeof value === "string" ? value : "";
          return (
            <div key={key}>
              <SingleImageUploader label={descriptor.label} value={src} onChange={(url) => set(key, url)} />
            </div>
          );
        }

        if (descriptor.type === "IMAGE_RESPONSIVE") {
          const responsive = (value as ResponsiveImageValue | undefined) ?? { desktop: "", mobile: "" };
          return (
            <div key={key} className="space-y-3">
              <span className={labelClass}>{descriptor.label}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SingleImageUploader
                  label="Desktop"
                  value={responsive.desktop}
                  onChange={(url) => set(key, { ...responsive, desktop: url })}
                />
                <SingleImageUploader
                  label="Mobile (optional — falls back to Desktop)"
                  value={responsive.mobile ?? ""}
                  onChange={(url) => set(key, { ...responsive, mobile: url })}
                />
              </div>
            </div>
          );
        }

        if (descriptor.type === "LINK") {
          const link = (value as { label: string; href: string } | undefined) ?? { label: "", href: "" };
          return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>{descriptor.label} — Text</span>
                <input
                  value={link.label}
                  onChange={(e) => set(key, { ...link, label: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>{descriptor.label} — Link</span>
                <input
                  value={link.href}
                  onChange={(e) => set(key, { ...link, href: e.target.value })}
                  placeholder="/collections"
                  className={inputClass}
                />
              </label>
            </div>
          );
        }

        if (descriptor.type === "LIST") {
          const items = Array.isArray(value) ? value : [];
          return (
            <div key={key}>
              <span className={labelClass}>{descriptor.label}</span>
              <div className="mt-2">
                <RepeatingListField
                  value={items}
                  onChange={(next) => set(key, next)}
                  fields={descriptor.listFields}
                  emptyItem={descriptor.emptyItem}
                  addLabel={`Add ${descriptor.itemLabel}`}
                />
              </div>
            </div>
          );
        }

        // NESTED_LIST
        const groups = Array.isArray(value) ? value : [];
        return (
          <div key={key}>
            <span className={labelClass}>{descriptor.label}</span>
            <div className="mt-2">
              <NestedListField
                value={groups}
                onChange={(next) => set(key, next)}
                groupNameField={descriptor.groupNameField}
                groupLabel={descriptor.groupLabel}
                itemsField={descriptor.itemsField}
                itemFields={descriptor.itemFields}
                itemLabel={descriptor.itemLabel}
                emptyItem={descriptor.emptyItem}
                emptyGroup={{ [descriptor.groupNameField]: "", [descriptor.itemsField]: [] }}
              />
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
      >
        {saved && <Check size={14} />}
        {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
      </button>
    </form>
  );
}
