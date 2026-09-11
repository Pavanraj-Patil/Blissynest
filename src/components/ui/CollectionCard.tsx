import Image from "next/image";
import Link from "next/link";

type CollectionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  dark?: boolean;
  // Callers that lay mobile out as a horizontal-scroll row need a fixed
  // card width (so cards don't collapse to fill the scroll container);
  // callers that lay mobile out as a grid need the card to fill its cell
  // instead. Defaults to the scroll-row behavior, matching this
  // component's original/only caller.
  fullWidthOnMobile?: boolean;
};

export function CollectionCard({
  title,
  subtitle,
  image,
  href,
  dark,
  fullWidthOnMobile,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block ${fullWidthOnMobile ? "w-full" : "shrink-0 w-[170px]"} sm:w-auto aspect-[4/5] overflow-hidden rounded-2xl`}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(min-width: 1024px) 19vw, 45vw"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          dark
            ? "from-black/85 via-black/20 to-transparent"
            : "from-black/55 via-black/0 to-transparent"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-serif text-lg text-cream leading-tight">
          {title}
        </h3>
        <p className="text-xs text-cream/80 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}
