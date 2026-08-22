"use client";

import { useState } from "react";
import { Truck, Clock } from "lucide-react";

export function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleCheck() {
    if (!/^\d{6}$/.test(pincode)) {
      setResult("Please enter a valid 6-digit pincode.");
      return;
    }
    const days = 3 + (Number(pincode.slice(-1)) % 3);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    setResult(`Delivered by ${formatted} to ${pincode}`);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-charcoal/10 pt-5">
      <div className="flex items-center gap-3">
        <Truck size={18} className="text-terracotta shrink-0" />
        <span className="text-sm text-charcoal">Check delivery date</span>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className="w-32 rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
          <button
            type="button"
            onClick={handleCheck}
            className="rounded-lg border border-charcoal/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          >
            Check
          </button>
        </div>
      </div>
      {result && <p className="text-xs text-ink-muted pl-[30px]">{result}</p>}
      <div className="flex items-center gap-3">
        <Clock size={18} className="text-terracotta shrink-0" />
        <span className="text-sm text-charcoal">
          Usually ships in <span className="font-medium">24-48 hours</span>
        </span>
      </div>
    </div>
  );
}
