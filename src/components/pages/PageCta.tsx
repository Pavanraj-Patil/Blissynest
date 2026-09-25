import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Action = { label: string; href: string };

// Closing band for info pages: one line of warmth and up to two next steps.
export function PageCta({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: Action;
  secondary?: Action;
}) {
  return (
    <section className="px-4 md:px-8 pb-16 md:pb-20">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] bg-olive px-6 py-12 text-center text-cream sm:px-12 md:py-16">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full border border-cream/15" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full border border-cream/15" />
        <h2 className="relative mx-auto max-w-xl font-serif text-3xl text-balance md:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/80 md:text-base">{body}</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-olive-dark transition-colors hover:bg-white"
          >
            {primary.label}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-cream/10"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
