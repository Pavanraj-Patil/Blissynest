"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type EditTile = { title: string; subtitle: string; slug: string; image: string };

// Collection cards for The Blissynest Edit. A snap-scrolling row on phones
// (next card peeks in, with a dot per card that follows the scroll and jumps
// to a card when tapped), a plain grid from sm up where every card is
// already visible and the dots are hidden.
export function EditCarousel({ tiles }: { tiles: EditTile[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // Auto-advance state: skip a tick while the shopper is touching/scrolling
  // (lastTouch) or the row is off-screen (inView).
  const lastTouch = useRef(0);
  const inView = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || tiles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.6 }
    );
    observer.observe(track);

    const timer = setInterval(() => {
      // Wider layouts show every card at once (grid) — nothing to advance.
      if (track.scrollWidth <= track.clientWidth + 1) return;
      if (!inView.current || document.hidden) return;
      if (Date.now() - lastTouch.current < 6000) return;
      goTo((activeRef.current + 1) % tiles.length);
    }, 4500);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [tiles.length]);

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    const step = second.offsetLeft - first.offsetLeft;
    if (step <= 0) return;
    const index = Math.round(track.scrollLeft / step);
    const next = Math.min(Math.max(index, 0), tiles.length - 1);
    activeRef.current = next;
    setActive(next);
  }

  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - (track.children[0] as HTMLElement).offsetLeft, behavior: "smooth" });
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={() => (lastTouch.current = Date.now())}
        onTouchMove={() => (lastTouch.current = Date.now())}
        onPointerDown={() => (lastTouch.current = Date.now())}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none -mx-4 scroll-px-4 px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-6 lg:grid-cols-4 xl:gap-8"
      >
        {tiles.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white/70 shadow-[0_12px_28px_-14px_rgba(42,38,33,0.35)] transition-shadow duration-200 hover:shadow-[0_16px_34px_-14px_rgba(42,38,33,0.45)] sm:w-auto"
          >
            <div className="relative aspect-[16/10] w-full sm:aspect-[4/3] lg:aspect-[5/4] overflow-hidden bg-cream-dark">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
              />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient xl:h-28-to-b from-charcoal/35 to-transparent" />
              <div className="absolute left-4 top-4 xl:left-6 xl:top-6">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] xl:text-[13px] text-white">
                  {c.title}
                </h3>
                <span className="mt-2 block h-px w-8 bg-white/80" />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 px-4 pb-4 pt-3.5 xl:gap-4 xl:px-5 xl:pb-5 xl:pt-4">
              <p className="font-serif text-sm leading-snug xl:text-base text-charcoal">{c.subtitle}</p>
              <span className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-terracotta-dark xl:text-xs">
                Explore collection
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {tiles.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {tiles.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              aria-label={`Show ${c.title}`}
              aria-current={i === active}
              onClick={() => {
                lastTouch.current = Date.now();
                goTo(i);
              }}
              className={cn(
                "relative h-2 rounded-full transition-all before:absolute before:-inset-2 before:content-['']",
                i === active ? "w-2 bg-terracotta" : "w-2 bg-charcoal/15"
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
