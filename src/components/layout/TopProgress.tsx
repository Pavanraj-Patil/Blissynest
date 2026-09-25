"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// A thin olive line across the very top of the screen that starts the moment
// a link is tapped and finishes when the next page has arrived — the "yes, it
// heard you" signal for slow connections. It creeps toward ~90% while
// waiting (never claims to be done early), then snaps to 100% and fades.
//
// It drives the element's style directly instead of through React state:
// it updates several times a second and must never re-render the app.
//
// Programmatic navigations (router.push from the search box, gift finder…)
// can't be seen from here, so they call startNavigationProgress() first.
export function startNavigationProgress() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("bn:progress-start"));
}

export function TopProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const barRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const value = useRef(0);
  const active = useRef(false);

  function paint(width: number, opacity: number) {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = `${width}%`;
    bar.style.opacity = String(opacity);
  }

  function finish() {
    if (!active.current) return;
    active.current = false;
    if (timer.current) clearInterval(timer.current);
    if (safety.current) clearTimeout(safety.current);
    paint(100, 1);
    hideTimer.current = setTimeout(() => {
      paint(100, 0);
      hideTimer.current = setTimeout(() => {
        value.current = 0;
        const bar = barRef.current;
        if (bar) bar.style.transition = "none";
        paint(0, 0);
        // Restore the transition on the next frame so the next run animates.
        requestAnimationFrame(() => {
          if (barRef.current) barRef.current.style.transition = "";
        });
      }, 250);
    }, 180);
  }

  // The route (path or query) changing is what "the page arrived" means.
  useEffect(() => {
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  useEffect(() => {
    function start() {
      if (active.current) return;
      active.current = true;
      if (hideTimer.current) clearTimeout(hideTimer.current);
      value.current = 8;
      paint(8, 1);
      timer.current = setInterval(() => {
        value.current += (90 - value.current) * 0.07;
        paint(value.current, 1);
      }, 200);
      // Never leave the bar hanging if a navigation is cancelled or fails.
      safety.current = setTimeout(finish, 15000);
    }

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("bn:progress-start", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("bn:progress-start", start);
      if (timer.current) clearInterval(timer.current);
      if (safety.current) clearTimeout(safety.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] bg-olive shadow-[0_0_8px_rgba(74,87,56,0.5)] transition-[width,opacity] duration-200 ease-out"
      style={{ width: 0, opacity: 0 }}
    />
  );
}
