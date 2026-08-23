import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { curatedCollections } from "@/lib/corporate-data";

export function CuratedCollections() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          Curated collections for every occasion
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {curatedCollections.map((c) =>
          c.isCustom ? (
            <Link
              key={c.slug}
              href="/corporate/quote?interest=custom"
              className="group flex flex-col items-center justify-center gap-3 aspect-[4/3] rounded-2xl border-2 border-dashed border-charcoal/20 hover:border-olive/50 transition-colors"
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
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dark">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 23vw, 45vw"
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
