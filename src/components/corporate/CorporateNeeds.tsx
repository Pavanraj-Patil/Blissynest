import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { corporateNeeds } from "@/lib/corporate-data";

type CorporateNeed = { slug: string; icon: LucideIcon; title: string; subtitle: string };

type Tone = {
  bg: string;
  text: string;
  subtext: string;
  border?: string;
};

const tones: Tone[] = [
  { bg: "bg-olive-dark", text: "text-cream", subtext: "text-cream/70" }, // employee — featured
  { bg: "bg-terracotta-light/35", text: "text-charcoal", subtext: "text-charcoal-light", border: "border-charcoal/10" }, // client
  { bg: "bg-gold-light/40", text: "text-charcoal", subtext: "text-charcoal-light", border: "border-charcoal/10" }, // festive
  { bg: "bg-cream-darker", text: "text-charcoal", subtext: "text-charcoal-light", border: "border-charcoal/10" }, // milestone
  { bg: "bg-terracotta", text: "text-cream", subtext: "text-cream/75" }, // welcome
  { bg: "bg-olive/15", text: "text-charcoal", subtext: "text-charcoal-light", border: "border-charcoal/10" }, // event
  { bg: "bg-charcoal", text: "text-cream", subtext: "text-cream/65" }, // custom
];

const areaNames = ["a", "b", "c", "d", "e", "f", "g"];

function NeedCard({
  need,
  tone,
  featured = false,
  gridArea,
}: {
  need: CorporateNeed;
  tone: Tone;
  featured?: boolean;
  gridArea?: string;
}) {
  return (
    <Link
      href={`/corporate/quote?interest=${need.slug}`}
      style={gridArea ? { gridArea } : undefined}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-0.5",
        tone.bg,
        tone.border ?? "border-transparent",
        featured ? "p-7 md:p-8" : ""
      )}
    >
      <need.icon
        size={featured ? 30 : 22}
        strokeWidth={1.25}
        className={cn(tone.text, "shrink-0 opacity-80")}
      />

      <div className="mt-6 shrink-0">
        <h3
          className={cn(
            "font-serif leading-tight",
            tone.text,
            featured ? "text-2xl md:text-[1.75rem]" : "text-base"
          )}
        >
          {need.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 leading-snug",
            tone.subtext,
            featured ? "text-sm max-w-[16rem]" : "text-xs"
          )}
        >
          {need.subtitle}
        </p>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-opacity",
            tone.text,
            featured
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          Explore
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

// slug -> content-schema field-name prefix (needEmployeeTitle, needEmployeeSubtitle, ...)
const slugToFieldPrefix: Record<string, string> = {
  employee: "needEmployee",
  client: "needClient",
  festive: "needFestive",
  milestone: "needMilestone",
  welcome: "needWelcome",
  event: "needEvent",
  custom: "needCustom",
};

export function CorporateNeeds({ content }: { content: Record<string, unknown> }) {
  const needs: CorporateNeed[] = corporateNeeds.map((need) => {
    const prefix = slugToFieldPrefix[need.slug];
    return {
      ...need,
      title: (content[`${prefix}Title`] as string) ?? need.title,
      subtitle: (content[`${prefix}Subtitle`] as string) ?? need.subtitle,
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
          gridTemplateRows: "repeat(3, 160px)",
          gridTemplateAreas: `"a a b c" "a a d e" "f f g g"`,
        }}
      >
        {needs.map((need, i) => (
          <NeedCard
            key={need.slug}
            need={need}
            tone={tones[i]}
            featured={i === 0}
            gridArea={areaNames[i]}
          />
        ))}
      </div>

      {/* Mobile / tablet: even grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:hidden">
        {needs.map((need, i) => (
          <div key={need.slug} className="min-h-[172px]">
            <NeedCard need={need} tone={tones[i]} />
          </div>
        ))}
      </div>
    </section>
  );
}
