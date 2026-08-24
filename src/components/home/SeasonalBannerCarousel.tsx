"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBannerIcon, getBannerGradientClasses } from "@/lib/banner-presets";

export type SlideInput = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  iconKey: string;
  gradientKey: string;
};

const AUTOPLAY_MS = 4500;

export function SeasonalBannerCarousel({ slides }: { slides: SlideInput[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function restartTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  function pauseTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    restartTimer();
    return () => pauseTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(index: number) {
    setActive(index);
    restartTimer();
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 md:py-8">
      <div
        className="relative h-36 sm:h-44 md:h-52 rounded-2xl overflow-hidden"
        onMouseEnter={pauseTimer}
        onMouseLeave={restartTimer}
      >
        {slides.map((slide, i) => {
          const Icon = getBannerIcon(slide.iconKey);
          const gradientClasses = getBannerGradientClasses(slide.gradientKey);
          const isActive = i === active;
          return (
            <Link
              key={slide.id}
              href={slide.href}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              className={`absolute inset-0 flex items-center overflow-hidden bg-gradient-to-br ${gradientClasses} px-6 sm:px-10 transition-opacity duration-700 ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <Icon
                size={150}
                strokeWidth={1}
                className="absolute -right-6 -bottom-10 text-cream/10 rotate-[-12deg]"
                aria-hidden="true"
              />
              <div className="relative max-w-sm">
                <span className="text-[10px] tracking-[0.15em] uppercase text-cream/70">
                  Featured this season
                </span>
                <h2 className="mt-1.5 font-serif text-xl sm:text-2xl text-cream leading-snug">
                  {slide.title}
                </h2>
                <p className="mt-1.5 hidden text-xs leading-relaxed text-cream/80 sm:block sm:text-sm">
                  {slide.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-cream">
                  Shop now
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-4">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${slide.title}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-5 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
