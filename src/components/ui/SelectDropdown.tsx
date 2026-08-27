"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  /**
   * Render the panel through a portal, positioned via the trigger's live
   * bounding rect, instead of `absolute`-inside-the-trigger. Needed when the
   * trigger sits in a horizontally-scrolling row (`overflow-x-auto` forces
   * `overflow-y` to clip too, per the CSS overflow spec, hiding the panel).
   */
  portal?: boolean;
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
  portal = false,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Portaled panels render outside rootRef (in document.body), so outside-click/
  // scroll detection needs to check this too or it treats every tap on an
  // option as "outside" and closes the panel before the click can register.
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function isInside(target: EventTarget | null) {
      const node = target as Node;
      return !!rootRef.current?.contains(node) || !!panelRef.current?.contains(node);
    }

    function handlePointerDown(e: MouseEvent) {
      if (!isInside(e.target)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    if (!portal) {
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    // A portaled panel is positioned from a snapshot of the trigger's rect —
    // close instead of drifting stale if the page or an ancestor scrolls/resizes.
    // Scrolling inside the options list itself doesn't count as that.
    function handleReposition(e: Event) {
      if (isInside(e.target)) return;
      setOpen(false);
    }
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, portal]);

  function toggleOpen() {
    if (!open && portal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((v) => !v);
  }

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
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
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

      {open &&
        (() => {
          const optionButtons = (
            <>
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
            </>
          );

          if (portal && panelPos) {
            return createPortal(
              <div
                ref={panelRef}
                role="listbox"
                style={{ top: panelPos.top, left: panelPos.left }}
                className={cn(
                  "fixed z-30 max-h-64 min-w-[11rem] w-max overflow-auto rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-xl",
                  panelClassName
                )}
              >
                {optionButtons}
              </div>,
              document.body
            );
          }

          return (
            <div
              role="listbox"
              className={cn(
                "absolute top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-xl",
                compact ? "left-0 min-w-[11rem] w-max" : "left-0 right-0",
                panelClassName
              )}
            >
              {optionButtons}
            </div>
          );
        })()}
    </div>
  );
}
