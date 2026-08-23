"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { category: string; items: FaqItem[] };

export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.category}>
          <h2 className="font-serif text-xl text-charcoal mb-4">{group.category}</h2>
          <div className="space-y-3">
            {group.items.map((item) => {
              const key = `${group.category}__${item.question}`;
              const isOpen = openKey === key;
              return (
                <div
                  key={key}
                  className="rounded-xl border border-charcoal/10 bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-charcoal">{item.question}</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "shrink-0 text-charcoal/40 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
