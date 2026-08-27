"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 5000;

type Testimonial = { quote: string; name: string; title: string; company: string };

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const active = testimonials[index];

  if (!active) return null;

  return (
    <div
      className="flex h-full min-h-[300px] flex-col rounded-3xl bg-cream-dark p-7 md:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Quote size={28} className="text-terracotta/50" />

      <div className="mt-3 flex-1">
        <p className="font-serif text-lg text-charcoal leading-snug">
          {active.quote}
        </p>
        <div className="mt-5">
          <p className="text-sm font-semibold text-charcoal">
            — {active.name}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">{active.title}</p>
          <p className="mt-2 eyebrow text-terracotta-dark">{active.company}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Show testimonial from ${t.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-terracotta" : "w-2 bg-charcoal/15 hover:bg-charcoal/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
