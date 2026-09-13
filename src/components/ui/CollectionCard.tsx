import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CollectionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  // Callers that lay mobile out as a horizontal-scroll row need a fixed
  // card width (so cards don't collapse to fill the scroll container);
  // callers that lay mobile out as a grid need the card to fill its cell
  // instead. Defaults to the scroll-row behavior, matching this
  // component's original/only caller.
  fullWidthOnMobile?: boolean;
};

export function CollectionCard({
  title,
  image,
  href,
  fullWidthOnMobile,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border border-transparent bg-transparent p-2.5 transition-colors duration-200 hover:border-white hover:bg-[#f8e7dd] ${
        fullWidthOnMobile ? "w-full" : "shrink-0 w-[170px]"
      } sm:w-auto`}
    >
      <h3 className="mb-2 text-center font-serif text-base font-semibold text-charcoal leading-tight">
        {title}
      </h3>

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-dark shadow-[0_10px_20px_-8px_rgba(42,38,33,0.28)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 19vw, 45vw"
        />
      </div>

      <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-terracotta-dark">
        Explore
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
