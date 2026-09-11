import Image from "next/image";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getContentIcon } from "@/lib/content-icons";
import type { LinkValue } from "@/lib/content-schema";

type TrustPoint = { icon: string; title: string; subtitle: string };

export function CorporateHero({ content }: { content: Record<string, unknown> }) {
  const heading = content.heading as string;
  const headingHighlight = content.headingHighlight as string;
  const subcopy = content.subcopy as string;
  const primaryCta = content.primaryCta as LinkValue;
  const secondaryCta = content.secondaryCta as LinkValue;
  const image = content.image as string;
  const trustPoints = content.trustPoints as TrustPoint[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 md:pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] text-charcoal">
            {heading}
            <br />
            <span className="text-olive">{headingHighlight}</span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-ink-muted leading-relaxed max-w-md">
            {subcopy}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button href={primaryCta.href} variant="primary">
              {primaryCta.label}
              <ArrowRight size={14} />
            </Button>
            <Button href={secondaryCta.href} variant="outline">
              <CalendarClock size={14} />
              {secondaryCta.label}
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {trustPoints.map((point) => {
              const Icon = getContentIcon(point.icon);
              return (
                <div key={point.title} className="flex items-start gap-2.5">
                  {Icon && (
                    <Icon size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-terracotta" />
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-charcoal leading-tight">
                      {point.title}
                    </h3>
                    <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">
                      {point.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
          <Image
            src={image}
            alt="A corporate gift box with a mug, candle, notebook and thank-you card"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
