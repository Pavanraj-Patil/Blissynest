import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type OccasionCardProps = {
  label: string;
  image: string;
  icon: LucideIcon | null;
  href?: string;
  dark?: boolean;
};

export function OccasionCard({
  label,
  image,
  icon: Icon,
  href = "#",
  dark,
}: OccasionCardProps) {
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
        className={`absolute inset-x-0 top-0 flex flex-col items-center gap-2 pt-6 text-center ${
          dark ? "text-cream" : "text-charcoal"
        }`}
      >
        {Icon && <Icon size={20} strokeWidth={1.5} />}
        <span className="text-xs font-medium">{label}</span>
      </div>
    </Link>
  );
}
