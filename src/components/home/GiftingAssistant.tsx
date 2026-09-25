"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, CalendarHeart, Gift, ArrowRight } from "lucide-react";
import { startNavigationProgress } from "@/components/layout/TopProgress";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { whoOptions, whoToAudience, occasionOptions, budgetOptions } from "@/lib/gifting-assistant-data";

const fields = [
  { key: "who", label: "Who are you gifting?", placeholder: "Who", icon: User, options: whoOptions },
  { key: "occasion", label: "What's the occasion?", placeholder: "Occasion", icon: CalendarHeart, options: occasionOptions },
  { key: "budget", label: "Your budget?", placeholder: "Budget", icon: Gift, options: budgetOptions },
] as const;

type FieldKey = (typeof fields)[number]["key"];

export function GiftingAssistant() {
  const router = useRouter();
  const [selections, setSelections] = useState<Record<FieldKey, string>>({
    who: "",
    occasion: "",
    budget: "",
  });

  function handleFindGift() {
    const params = new URLSearchParams();
    // Marks the visit as coming from the gift finder, so the results page
    // doesn't show a second "Not sure what to gift?" banner further down.
    params.set("from", "finder");
    if (selections.occasion) params.set("occasion", selections.occasion);
    if (selections.budget) params.set("budget", selections.budget);
    const query = params.toString();
    const audience = selections.who ? whoToAudience[selections.who] : null;
    const base = audience ? `/shop/${audience}` : "/shop";
    startNavigationProgress();
    router.push(`${base}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      {/* Compact horizontal banner below the hero on phones/tablets */}
      <div className="md:hidden relative z-10 -mt-5 rounded-2xl bg-white shadow-xl shadow-charcoal/10 px-4 py-3.5">
        <p className="text-xs font-serif text-charcoal text-center mb-2.5">
          <span className="text-terracotta">✦</span> Not sure what to gift?
        </p>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {fields.map((field) => (
                <SelectDropdown
                  key={field.key}
                  compact
                  portal
                  placeholder={field.placeholder}
                  icon={field.icon}
                  options={field.options}
                  value={selections[field.key]}
                  onChange={(v) => setSelections((prev) => ({ ...prev, [field.key]: v }))}
                  triggerClassName="bg-cream/60 shrink-0"
                />
              ))}
            </div>
            {/* Fades the trailing edge so a partially-scrolled-off dropdown
                doesn't look like it's just crammed against the CTA button. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent"
            />
          </div>
          <button
            type="button"
            onClick={handleFindGift}
            aria-label="Find my gift"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-olive text-cream shrink-0 hover:bg-olive-dark transition-colors"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Full card on larger screens */}
      <div className="hidden md:block relative z-10 md:-mt-14 lg:-mt-20 mx-auto max-w-5xl rounded-3xl bg-white shadow-2xl shadow-charcoal/10 px-12 py-12">
        <div className="text-center mb-9">
          <h2 className="font-serif text-2xl text-charcoal">
            <span className="text-terracotta">✦</span> Not sure what to gift?{" "}
            <span className="text-terracotta">✦</span>
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Let our Gifting Assistant help you find the perfect match.
          </p>
        </div>

        <div className="flex items-end gap-4">
          {fields.map((field) => (
            <SelectDropdown
              key={field.key}
              label={field.label}
              icon={field.icon}
              options={field.options}
              value={selections[field.key]}
              onChange={(v) => setSelections((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}

          <button
            type="button"
            onClick={handleFindGift}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0"
          >
            Find My Gift
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
