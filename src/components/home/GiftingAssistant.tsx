"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, CalendarHeart, Gift, ArrowRight } from "lucide-react";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { whoOptions, occasionOptions, budgetOptions } from "@/lib/gifting-assistant-data";

const fields = [
  { key: "who", label: "Who are you gifting?", icon: User, options: whoOptions },
  { key: "occasion", label: "What's the occasion?", icon: CalendarHeart, options: occasionOptions },
  { key: "budget", label: "Your budget?", icon: Gift, options: budgetOptions },
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
    if (selections.who) params.set("who", selections.who);
    if (selections.occasion) params.set("occasion", selections.occasion);
    if (selections.budget) params.set("budget", selections.budget);
    const query = params.toString();
    router.push(`/gifting-assistant${query ? `?${query}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="relative z-10 -mt-6 sm:-mt-8 md:-mt-14 lg:-mt-20 mx-auto max-w-5xl rounded-3xl bg-white shadow-2xl shadow-charcoal/10 px-6 py-10 md:px-12 md:py-12">
        <div className="text-center mb-9">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">
            <span className="text-terracotta">✦</span> Not sure what to gift?{" "}
            <span className="text-terracotta">✦</span>
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Let our Gifting Assistant help you find the perfect match.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-4">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0 md:w-auto w-full"
          >
            Find My Gift
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
