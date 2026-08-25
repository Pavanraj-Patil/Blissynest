import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Briefcase,
  PartyPopper,
  PackageOpen,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { corporateChecklist } from "@/lib/mock-data";

const checklistIcons = [Users, Briefcase, PartyPopper, PackageOpen, CalendarDays];

const corporateImage =
  "https://placehold.co/560x460/1c1712/cfb587.png?text=Corporate+Gift+Set&font=playfair-display";

export function CorporateBanner() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-7">
      <div className="rounded-3xl bg-charcoal text-cream px-6 py-12 md:px-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-[2.5rem] leading-[1.1]">
              Thoughtful gifting,
              <br />
              at scale.
            </h2>
            <p className="mt-4 text-cream/70 text-sm leading-relaxed max-w-sm">
              From employee welcome kits to premium client gifts, Blissynest
              makes corporate gifting effortless.
            </p>
            <Button href="/corporate" variant="primary" className="mt-7">
              Explore Corporate Gifting
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="relative aspect-[6/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl">
            <Image
              src={corporateImage}
              alt="Corporate gifting flatlay with notebook, bottle, and mug"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 90vw"
            />
          </div>

          <div>
            <ul className="space-y-4">
              {corporateChecklist.map((item, i) => {
                const Icon = checklistIcons[i];
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
              href="/corporate/quote"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors"
            >
              Request a Quote
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
