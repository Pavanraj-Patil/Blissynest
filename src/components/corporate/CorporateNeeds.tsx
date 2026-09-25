import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { corporateNeeds } from "@/lib/corporate-data";
import { getContentIcon } from "@/lib/content-icons";

type CorporateNeed = {
  slug: string;
  icon: LucideIcon | null;
  title: string;
  subtitle: string;
  image: string;
};

function NeedCard({ need, featured = false }: { need: CorporateNeed; featured?: boolean }) {
  return (
    <Link
      href={`/corporate/${need.slug}`}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-2xl bg-charcoal shadow-[0_10px_24px_-14px_rgba(42,38,33,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_-14px_rgba(42,38,33,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive",
        // Phones/tablets: the first card spans the row and is wide; the rest
        // are tiles in two columns. From lg up the row heights are set by the
        // grid instead (a tall feature beside a 2x2).
        featured
          ? "col-span-2 aspect-[16/10] sm:aspect-[21/9] lg:row-span-2 lg:aspect-auto"
          : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto"
      )}
    >
      <Image
        src={need.image}
        alt=""
        fill
        className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={featured ? "(min-width: 1024px) 45vw, 92vw" : "(min-width: 1024px) 22vw, 46vw"}
      />
      {/* Darkens the bottom for the text, and the top corner for the icon chip. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

      {need.icon && (
        <span
          className={cn(
            "absolute left-4 top-4 flex items-center justify-center rounded-full bg-white/15 text-cream backdrop-blur-sm ring-1 ring-white/25",
            featured ? "h-11 w-11" : "h-9 w-9"
          )}
        >
          <need.icon size={featured ? 22 : 18} strokeWidth={1.4} />
        </span>
      )}

      <div className={cn("relative mt-auto w-full", featured ? "p-5 pr-16 md:p-7 md:pr-20" : "p-4 pr-14")}>
        <h3
          className={cn(
            "font-serif leading-tight text-cream",
            featured ? "text-2xl md:text-3xl" : "text-[15px] sm:text-lg"
          )}
        >
          {need.title}
        </h3>
        <p
          className={cn(
            "mt-1 leading-snug text-cream/80",
            featured ? "text-sm md:text-[15px]" : "line-clamp-2 text-xs sm:text-sm"
          )}
        >
          {need.subtitle}
        </p>
      </div>

      <span
        aria-hidden
        className={cn(
          "absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-cream text-charcoal transition-colors duration-300 group-hover:bg-terracotta group-hover:text-cream",
          featured ? "h-10 w-10 md:bottom-6 md:right-6 md:h-11 md:w-11" : "h-8 w-8"
        )}
      >
        <ArrowUpRight
          size={featured ? 18 : 15}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}

// slug -> content-schema field-name prefix (needEmployeeTitle, needEmployeeSubtitle, needEmployeeImage, ...)
const slugToFieldPrefix: Record<string, string> = {
  employee: "needEmployee",
  client: "needClient",
  festive: "needFestive",
  milestone: "needMilestone",
  welcome: "needWelcome",
};

export function CorporateNeeds({ content }: { content: Record<string, unknown> }) {
  const needs: CorporateNeed[] = corporateNeeds.map((need) => {
    const prefix = slugToFieldPrefix[need.slug];
    return {
      ...need,
      title: (content[`${prefix}Title`] as string) ?? need.title,
      subtitle: (content[`${prefix}Subtitle`] as string) ?? need.subtitle,
      image: (content[`${prefix}Image`] as string) || need.image,
      icon: getContentIcon((content[`${prefix}Icon`] as string) ?? ""),
    };
  });

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="mb-8 text-center md:mb-10">
        <p className="eyebrow mb-2 text-terracotta-dark">{content.eyebrow as string}</p>
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
          {content.heading as string}
        </h2>
      </div>

      {/* Phones and tablets: a wide first card over a 2x2 of tiles (no orphan
          cell with five cards). Desktop: the first card becomes a tall feature
          on the left beside the 2x2. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[190px] lg:grid-cols-4 lg:gap-5">
        {needs.map((need, i) => (
          <NeedCard key={need.slug} need={need} featured={i === 0} />
        ))}
      </div>
    </section>
  );
}
