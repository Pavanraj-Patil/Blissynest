import Link from "next/link";
import { corporateNeeds } from "@/lib/corporate-data";

export function CorporateNeeds() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          Gifts for every corporate need
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-5">
        {corporateNeeds.map((need) => (
          <Link
            key={need.slug}
            href={`/corporate/quote?interest=${need.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-4 py-6 text-center hover:border-olive/40 hover:shadow-sm transition-all"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-dark text-terracotta group-hover:bg-olive/10 group-hover:text-olive transition-colors">
              <need.icon size={20} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-charcoal leading-tight">
                {need.title}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-tight">
                {need.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
