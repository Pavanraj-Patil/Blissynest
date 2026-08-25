import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";
import type { LinkValue } from "@/lib/content-schema";

type ChecklistItem = { icon: string; label: string; href: string };

export async function CorporateBanner() {
  const content = await getPageContent("home");
  const section = content["corporate-banner"];
  const heading = section.heading as string;
  const subcopy = section.subcopy as string;
  const cta = section.cta as LinkValue;
  const quoteLink = section.quoteLink as LinkValue;
  const image = section.image as string;
  const checklist = section.checklist as ChecklistItem[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-7">
      <div className="rounded-3xl bg-charcoal text-cream px-6 py-12 md:px-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-[2.5rem] leading-[1.1]">
              {heading}
            </h2>
            <p className="mt-4 text-cream/70 text-sm leading-relaxed max-w-sm">
              {subcopy}
            </p>
            <Button href={cta.href} variant="primary" className="mt-7">
              {cta.label}
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="relative aspect-[6/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt="Corporate gifting flatlay with notebook, bottle, and mug"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 90vw"
            />
          </div>

          <div>
            <ul className="space-y-4">
              {checklist.map((item) => {
                const Icon = getContentIcon(item.icon);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-sm text-cream/85 hover:text-cream transition-colors"
                    >
                      <Icon size={16} className="text-gold-light" strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={quoteLink.href}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors"
            >
              {quoteLink.label}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
