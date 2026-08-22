"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/cn";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setActive((i) => (i + 1) % images.length);
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                active === i ? "border-terracotta" : "border-transparent"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl bg-cream-dark">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <span className="absolute bottom-3 left-3 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm">
          <Search size={15} />
        </span>
      </div>
    </div>
  );
}
