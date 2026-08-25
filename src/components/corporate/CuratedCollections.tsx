"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { curatedCollections } from "@/lib/corporate-data";

// slug -> content-schema field-name prefix (collectionWelcomeKitsTitle, ...)
// — "custom" has no entry since that tile's title is a fixed CTA, not content.
const slugToFieldPrefix: Record<string, string> = {
  "welcome-kits": "collectionWelcomeKits",
  diwali: "collectionDiwali",
  "work-anniversary": "collectionWorkAnniversary",
  "womens-day": "collectionWomensDay",
  holiday: "collectionHoliday",
  "client-appreciation": "collectionClientAppreciation",
};

export function CuratedCollections({ content }: { content: Record<string, unknown> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const collections = curatedCollections.map((c) => {
    const prefix = slugToFieldPrefix[c.slug];
    return prefix ? { ...c, title: (content[`${prefix}Title`] as string) ?? c.title } : c;
  });

  function scroll(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow text-terracotta-dark mb-2">{content.eyebrow as string}</p>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
            {content.heading as string}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal hover:bg-cream-dark transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal hover:bg-cream-dark transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {collections.map((c) =>
          c.isCustom ? (
            <Link
              key={c.slug}
              href="/corporate/quote?interest=custom"
              className="group flex w-[210px] sm:w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-3 aspect-[4/3] rounded-2xl border-2 border-dashed border-charcoal/20 hover:border-olive/50 transition-colors"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-dark text-olive group-hover:bg-olive/10 transition-colors">
                <Plus size={20} strokeWidth={1.5} />
              </span>
              <div className="text-center px-4">
                <h3 className="text-sm font-medium text-charcoal">{c.title}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-terracotta-dark">
                  Explore
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              key={c.slug}
              href={`/corporate/quote?interest=${c.slug}`}
              className="group w-[210px] sm:w-[240px] shrink-0 snap-start"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dark">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="240px"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-charcoal">{c.title}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-terracotta-dark group-hover:text-terracotta transition-colors">
                  Explore
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
