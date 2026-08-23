"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectDropdownProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
};

export function SelectDropdown({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Select",
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

  return (
    <div ref={rootRef} className="relative flex-1 min-w-0 block">
      <span className="eyebrow block text-[10px] text-charcoal-light mb-2">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-cream/60 px-3.5 py-3 text-left transition-colors",
          open ? "border-olive ring-2 ring-olive/15" : "border-charcoal/15 hover:border-charcoal/30"
        )}
      >
        <Icon size={16} className="text-terracotta shrink-0" />
        <span className={cn("flex-1 truncate text-sm", value ? "text-charcoal" : "text-ink-muted")}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={cn("shrink-0 text-charcoal/40 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onClick={() => select("")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
              value === "" ? "text-charcoal font-medium" : "text-ink-muted hover:bg-cream-dark"
            )}
          >
            {placeholder}
            {value === "" && <Check size={14} className="text-olive" />}
          </button>

          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(opt)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-olive/10 text-olive-dark font-medium"
                    : "text-charcoal hover:bg-cream-dark"
                )}
              >
                {opt}
                {active && <Check size={14} className="text-olive" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
