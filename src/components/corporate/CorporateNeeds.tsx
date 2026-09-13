import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
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

const areaNames = ["a", "b", "c", "d", "e"];

function NeedCard({
  need,
  featured = false,
  gridArea,
}: {
  need: CorporateNeed;
  featured?: boolean;
  gridArea?: string;
}) {
  return (
    <Link
      href={`/corporate/${need.slug}`}
      style={gridArea ? { gridArea } : undefined}
      className={cn(
        "group relative flex h-full min-h-[172px] flex-col justify-between overflow-hidden rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5",
        featured ? "p-7 md:p-8" : ""
      )}
    >
      <Image
        src={need.image}
        alt=""
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={featured ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 22vw, 45vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      {need.icon && (
        <need.icon
          size={featured ? 30 : 22}
          strokeWidth={1.25}
          className="relative shrink-0 text-cream/90"
        />
      )}

      <div className="relative mt-6 shrink-0">
        <h3
          className={cn(
            "font-serif leading-tight text-cream",
            featured ? "text-2xl md:text-[1.75rem]" : "text-base"
          )}
        >
          {need.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 leading-snug text-cream/80",
            featured ? "text-sm max-w-[16rem]" : "text-xs"
          )}
        >
          {need.subtitle}
        </p>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cream transition-opacity",
            featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          Explore
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
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
      <div className="text-center mb-10">
        <p className="eyebrow text-terracotta-dark mb-2">{content.eyebrow as string}</p>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          {content.heading as string}
        </h2>
      </div>

      {/* Desktop: asymmetric bento grid */}
      <div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 160px)",
          gridTemplateAreas: `"a a b c" "a a d e"`,
        }}
      >
        {needs.map((need, i) => (
          <NeedCard key={need.slug} need={need} featured={i === 0} gridArea={areaNames[i]} />
        ))}
      </div>

      {/* Mobile / tablet: even grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:hidden">
        {needs.map((need) => (
          <NeedCard key={need.slug} need={need} />
        ))}
      </div>
    </section>
  );
}
