"use client";

import { Plus, Trash2 } from "lucide-react";

export type ListFieldDef<T> =
  | { key: keyof T; label: string; kind: "text"; placeholder?: string }
  | { key: keyof T; label: string; kind: "number"; min?: number }
  | { key: keyof T; label: string; kind: "checkbox" }
  | { key: keyof T; label: string; kind: "select"; options: readonly string[] }
  | { key: keyof T; label: string; kind: "color" }
  // Comma-separated text in the UI, stored as string[] on the object.
  | { key: keyof T; label: string; kind: "taglist"; placeholder?: string };

const inputClass =
  "mt-1 w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";
const fieldLabelClass = "block text-[11px] font-medium text-charcoal-light";

export function RepeatingListField<T extends Record<string, unknown>>({
  value,
  onChange,
  fields,
  emptyItem,
  addLabel,
}: {
  value: T[];
  onChange: (next: T[]) => void;
  fields: ListFieldDef<T>[];
  emptyItem: T;
  addLabel: string;
}) {
  function updateItem(index: number, key: keyof T, fieldValue: unknown) {
    onChange(value.map((item, i) => (i === index ? { ...item, [key]: fieldValue } : item)));
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-charcoal/15 bg-cream/40 p-3.5 pr-11">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-2.5">
            {fields.map((field) => {
              const key = String(field.key);
              const raw = item[field.key];

              if (field.kind === "checkbox") {
                return (
                  <label key={key} className="flex items-end gap-1.5 pb-2 text-xs text-charcoal-light">
                    <input
                      type="checkbox"
                      checked={Boolean(raw)}
                      onChange={(e) => updateItem(i, field.key, e.target.checked)}
                      className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                    />
                    {field.label}
                  </label>
                );
              }

              if (field.kind === "color") {
                return (
                  <label key={key} className={fieldLabelClass}>
                    {field.label}
                    <input
                      type="color"
                      value={typeof raw === "string" ? raw : "#2a2621"}
                      onChange={(e) => updateItem(i, field.key, e.target.value)}
                      className="mt-1 h-9 w-14 cursor-pointer rounded-lg border border-charcoal/15"
                    />
                  </label>
                );
              }

              if (field.kind === "select") {
                return (
                  <label key={key} className={fieldLabelClass}>
                    {field.label}
                    <select
                      value={typeof raw === "string" ? raw : field.options[0]}
                      onChange={(e) => updateItem(i, field.key, e.target.value)}
                      className={inputClass}
                    >
                      {/* Every current use of "select" is an icon picker
                          (see content-schema.ts / ProductForm's spec icon),
                          and "no icon here" is a legitimate choice the form
                          had no way to express before — see
                          getContentIcon's "" handling. */}
                      <option value="">None</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }

              if (field.kind === "number") {
                return (
                  <label key={key} className={fieldLabelClass}>
                    {field.label}
                    <input
                      type="number"
                      min={field.min ?? 0}
                      value={typeof raw === "number" ? raw : ""}
                      onChange={(e) => updateItem(i, field.key, Number(e.target.value))}
                      className={inputClass}
                    />
                  </label>
                );
              }

              if (field.kind === "taglist") {
                const tags = Array.isArray(raw) ? (raw as string[]) : [];
                return (
                  <label key={key} className={fieldLabelClass}>
                    {field.label}
                    <input
                      placeholder={field.placeholder}
                      value={tags.join(", ")}
                      onChange={(e) =>
                        updateItem(
                          i,
                          field.key,
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className={inputClass}
                    />
                  </label>
                );
              }

              // Image-URL fields (by convention, keyed "image") get a live
              // thumbnail preview — matching the top-level IMAGE field type
              // in ContentSectionForm, instead of just a bare text input.
              const isImageField = key === "image";
              const imageValue = typeof raw === "string" ? raw : "";
              return (
                <label key={key} className={fieldLabelClass}>
                  {field.label}
                  <div className={isImageField ? "mt-1 flex items-center gap-2" : undefined}>
                    <input
                      placeholder={field.placeholder}
                      value={imageValue}
                      onChange={(e) => updateItem(i, field.key, e.target.value)}
                      className={isImageField ? `${inputClass} mt-0 flex-1` : inputClass}
                    />
                    {isImageField && imageValue && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageValue}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-lg border border-charcoal/10 object-cover"
                      />
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            aria-label="Remove"
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark hover:text-terracotta-dark"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, emptyItem])}
        className="flex items-center gap-1.5 text-xs font-medium text-terracotta-dark hover:text-terracotta"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}
