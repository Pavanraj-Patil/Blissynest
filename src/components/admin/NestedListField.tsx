"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { RepeatingListField, type ListFieldDef } from "./RepeatingListField";
import { ConfirmDialog } from "./ConfirmDialog";

const inputClass =
  "mt-1 w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";

// A list of groups, each holding its own repeating list — e.g. FAQ
// categories, each with its own Q&A list. RepeatingListField's rows are
// flat, so this wraps it once per group instead of teaching it to nest.
export function NestedListField<G extends Record<string, unknown>>({
  value,
  onChange,
  groupNameField,
  groupLabel,
  itemsField,
  itemFields,
  itemLabel,
  emptyItem,
  emptyGroup,
}: {
  value: G[];
  onChange: (next: G[]) => void;
  groupNameField: string;
  groupLabel: string;
  itemsField: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemFields: ListFieldDef<any>[];
  itemLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emptyItem: any;
  emptyGroup: G;
}) {
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  function updateGroup(index: number, patch: Partial<G>) {
    onChange(value.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function confirmRemove() {
    if (removingIndex === null) return;
    onChange(value.filter((_, idx) => idx !== removingIndex));
    setRemovingIndex(null);
  }

  return (
    <div className="space-y-4">
      {value.map((group, i) => (
        <div key={i} className="rounded-xl border border-charcoal/15 bg-white p-4 space-y-3">
          <div className="flex items-end gap-2">
            <label className="block flex-1 text-[11px] font-medium text-charcoal-light">
              Category Name
              <input
                value={(group[groupNameField] as string) ?? ""}
                onChange={(e) => updateGroup(i, { [groupNameField]: e.target.value } as Partial<G>)}
                placeholder="Category name"
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={() => setRemovingIndex(i)}
              aria-label="Remove category"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark hover:text-terracotta-dark"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <RepeatingListField
            value={(group[itemsField] as Record<string, unknown>[]) ?? []}
            onChange={(next) => updateGroup(i, { [itemsField]: next } as Partial<G>)}
            fields={itemFields}
            emptyItem={emptyItem}
            addLabel={itemLabel}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, emptyGroup])}
        className="flex items-center gap-1.5 text-xs font-medium text-terracotta-dark hover:text-terracotta"
      >
        <Plus size={13} /> {groupLabel}
      </button>

      <ConfirmDialog
        open={removingIndex !== null}
        title="Remove this category?"
        description="Its whole list of entries goes with it. Nothing is written to the site until you save this section, so you can still back out by leaving without saving."
        confirmLabel="Remove"
        onConfirm={confirmRemove}
        onCancel={() => setRemovingIndex(null)}
      />
    </div>
  );
}
