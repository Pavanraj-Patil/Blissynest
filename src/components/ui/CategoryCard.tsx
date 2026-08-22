import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CategoryCardProps = {
  label: string;
  image: string;
  href: string;
};

export function CategoryCard({ label, image, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group block shrink-0 w-[150px] sm:w-auto">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 16vw, 45vw"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-charcoal">{label}</span>
        <ArrowRight
          size={14}
          className="text-charcoal/50 group-hover:text-terracotta-dark group-hover:translate-x-0.5 transition-all shrink-0"
        />
      </div>
    </Link>
  );
}
