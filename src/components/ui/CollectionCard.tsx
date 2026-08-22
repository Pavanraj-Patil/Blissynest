import Image from "next/image";
import Link from "next/link";

type CollectionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  dark?: boolean;
};

export function CollectionCard({
  title,
  subtitle,
  image,
  dark,
}: CollectionCardProps) {
  return (
    <Link
      href="#"
      className="group relative block shrink-0 w-[170px] sm:w-auto aspect-[4/5] overflow-hidden rounded-2xl"
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
