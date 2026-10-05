"use client";

import { useEffect, useState } from "react";

function partsUntil(targetMs: number, nowMs: number) {
  const totalSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: totalSeconds <= 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

// A small ticking countdown to the admin-set "expected back" time. Once it
// passes, it quietly switches to a reassuring line instead of sitting at
// 00:00:00 — the team may still be finishing up.
export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // useState(() => …) rather than Date.now() directly: a value computed
  // during render must be pure, and the clock itself isn't.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { hours, minutes, seconds, done } = partsUntil(targetMs, now);

  if (done) {
    return (
      <p className="mt-7 text-sm font-medium text-olive-dark">
        Just putting on the final touches — any moment now.
      </p>
    );
  }

  return (
    <div
      role="timer"
      aria-live="off"
      className="mx-auto mt-7 inline-flex items-center gap-2.5 rounded-full border border-charcoal/15 bg-white px-5 py-2.5 text-sm text-charcoal"
    >
      <span className="text-ink-muted">Back in</span>
      <span className="font-mono text-base tabular-nums tracking-wide text-charcoal">
        {hours > 0 && `${pad(hours)}:`}
        {pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}
