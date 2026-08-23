"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Option = string | { value: string; label: string };

type SelectDropdownProps = {
  label?: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  /** Show a clearable placeholder row in the panel (e.g. "Any"). Off for things like Sort that always have a real value. */
  showPlaceholderOption?: boolean;
  /** Tighter, auto-width trigger for toolbars — no caption row, no forced bg tint. */
  compact?: boolean;
  triggerClassName?: string;
  panelClassName?: string;
};

function normalize(opt: Option): { value: string; label: string } {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

export function SelectDropdown({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Select",
  showPlaceholderOption = true,
  compact = false,
  triggerClassName,
  panelClassName,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function select(next: string) {
    onChange(next);
    setOpen(false);
  }

  const normalizedOptions = options.map(normalize);
  const activeLabel = normalizedOptions.find((o) => o.value === value)?.label;

  return (
    <div
      ref={rootRef}
      className={cn("relative block", compact ? "inline-block" : "flex-1 min-w-0")}
    >
      {label && (
        <span className="eyebrow block text-[10px] text-charcoal-light mb-2">
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 border text-left transition-colors",
          compact
            ? "rounded-lg bg-white px-3.5 py-2.5 text-sm"
            : "w-full rounded-xl bg-cream/60 px-3.5 py-3",
          open ? "border-olive ring-2 ring-olive/15" : "border-charcoal/15 hover:border-charcoal/30",
          triggerClassName
        )}
      >
        {Icon && <Icon size={16} className="text-terracotta shrink-0" />}
        <span
          className={cn(
            "truncate text-sm",
            compact ? "" : "flex-1",
            value ? "text-charcoal" : "text-ink-muted"
          )}
        >
          {activeLabel || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-charcoal/40 transition-transform",
            compact ? "ml-auto" : "",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-xl",
            compact ? "left-0 min-w-[11rem] w-max" : "left-0 right-0",
            panelClassName
          )}
        >
          {showPlaceholderOption && (
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => select("")}
              className={cn(
                "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                value === "" ? "text-charcoal font-medium" : "text-ink-muted hover:bg-cream-dark"
              )}
            >
              {placeholder}
              {value === "" && <Check size={14} className="text-olive shrink-0" />}
            </button>
          )}

          {normalizedOptions.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm transition-colors whitespace-nowrap",
                  active
                    ? "bg-olive/10 text-olive-dark font-medium"
                    : "text-charcoal hover:bg-cream-dark"
                )}
              >
                {opt.label}
                {active && <Check size={14} className="text-olive shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
