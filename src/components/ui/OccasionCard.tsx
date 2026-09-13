import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type OccasionCardProps = {
  label: string;
  image: string;
  href?: string;
  dark?: boolean;
};

export function OccasionCard({ label, image, href = "#", dark }: OccasionCardProps) {
  return (
    <Link
      href={href}
      className="group relative block shrink-0 w-[130px] sm:w-auto aspect-[3/4.3] overflow-hidden rounded-2xl"
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(min-width: 1024px) 13vw, 40vw"
      />
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${
          dark ? "from-black/45" : "from-white/40"
        } to-transparent`}
      />
      <div className="absolute inset-x-0 top-0 flex items-start gap-1 p-3.5">
        <span
          className={`font-serif text-base sm:text-lg font-semibold leading-tight ${
            dark ? "text-cream" : "text-charcoal"
          }`}
        >
          {label}
        </span>
        <ArrowRight
          size={15}
          strokeWidth={2}
          className={`mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 ${
            dark ? "text-cream/75" : "text-charcoal/55"
          }`}
        />
      </div>
    </Link>
  );
}
