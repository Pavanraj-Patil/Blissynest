"use client";

export type CheckboxGroupOption = { value: string; label: string };

// Flat `string[]` multi-select rendered as a grid of checkboxes, driven by a
// fixed `options` list. For fields whose valid options depend on another
// field's value (e.g. ProductForm's Recipient Tags depending on Audience,
// Category depending on Collection Slug), pass a recomputed `options` prop —
// this component itself stays stateless about where the list comes from.
export function CheckboxGroupField({
  value,
  onChange,
  options,
  emptyHint,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: CheckboxGroupOption[];
  emptyHint?: string;
}) {
  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    );
  }

  if (options.length === 0) {
    return emptyHint ? <p className="text-xs text-ink-muted">{emptyHint}</p> : null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-1.5 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
              checked
                ? "border-olive bg-olive/10 text-charcoal"
                : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 rounded border-charcoal/25 accent-olive"
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
