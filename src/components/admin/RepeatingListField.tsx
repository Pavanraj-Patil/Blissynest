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
  "w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";

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
        <div key={i} className="flex flex-wrap items-start gap-2 rounded-lg border border-charcoal/10 p-2.5">
          {fields.map((field) => {
            const key = String(field.key);
            const raw = item[field.key];

            if (field.kind === "checkbox") {
              return (
                <label
                  key={key}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-charcoal-light whitespace-nowrap"
                >
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
                <input
                  key={key}
                  type="color"
                  value={typeof raw === "string" ? raw : "#2a2621"}
                  onChange={(e) => updateItem(i, field.key, e.target.value)}
                  aria-label={field.label}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-charcoal/15"
                />
              );
            }

            if (field.kind === "select") {
              return (
                <select
                  key={key}
                  value={typeof raw === "string" ? raw : field.options[0]}
                  onChange={(e) => updateItem(i, field.key, e.target.value)}
                  aria-label={field.label}
                  className={`${inputClass} min-w-[8rem] flex-1 basis-32`}
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              );
            }

            if (field.kind === "number") {
              return (
                <input
                  key={key}
                  type="number"
                  min={field.min ?? 0}
                  placeholder={field.label}
                  value={typeof raw === "number" ? raw : ""}
                  onChange={(e) => updateItem(i, field.key, Number(e.target.value))}
                  aria-label={field.label}
                  className={`${inputClass} min-w-[6rem] basis-24`}
                />
              );
            }

            if (field.kind === "taglist") {
              const tags = Array.isArray(raw) ? (raw as string[]) : [];
              return (
                <input
                  key={key}
                  placeholder={field.placeholder ?? field.label}
                  value={tags.join(", ")}
                  onChange={(e) =>
                    updateItem(
                      i,
                      field.key,
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  aria-label={field.label}
                  className={`${inputClass} min-w-[10rem] flex-1 basis-48`}
                />
              );
            }

            return (
              <input
                key={key}
                placeholder={field.placeholder ?? field.label}
                value={typeof raw === "string" ? raw : ""}
                onChange={(e) => updateItem(i, field.key, e.target.value)}
                aria-label={field.label}
                className={`${inputClass} min-w-[8rem] flex-1 basis-32`}
              />
            );
          })}

          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark"
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
