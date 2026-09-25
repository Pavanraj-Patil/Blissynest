"use client";

import { useEffect, useState } from "react";
import { GiftBoxLoader } from "@/components/ui/GiftBoxLoader";

// Appears only if loading drags on: nothing for the first `after` ms (so quick
// loads never flash it), then the gift-box mark. With `retry`, it also offers
// a reload button — for the "is my connection okay?" moment.
export function SlowLoadNotice({
  after = 500,
  label = "Wrapping things up…",
  hint,
  retry = false,
  className = "",
}: {
  after?: number;
  label?: string;
  hint?: string;
  retry?: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), after);
    return () => clearTimeout(t);
  }, [after]);

  if (!show) return null;

  return (
    <div className={`flex flex-col items-center gap-3 py-8 ${className}`}>
      <GiftBoxLoader label={label} hint={hint} size={80} />
      {retry && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full border border-charcoal/20 px-5 py-2 text-xs font-semibold text-charcoal hover:bg-cream-dark"
        >
          Try again
        </button>
      )}
    </div>
  );
}
