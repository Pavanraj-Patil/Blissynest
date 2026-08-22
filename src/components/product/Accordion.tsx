"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-charcoal/10 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-charcoal"
      >
        {title}
        {open ? (
          <ChevronUp size={16} className="text-charcoal/50 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-charcoal/50 shrink-0" />
        )}
      </button>
      {open && (
        <div className="mt-3 text-sm text-ink-muted leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
