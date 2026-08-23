import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { whyChooseUsChecklist, yourBrandImage } from "@/lib/corporate-data";

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="rounded-3xl bg-olive-dark text-cream px-6 py-10 md:px-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-[1.75rem] leading-tight">
                Why businesses love gifting with Blissynest
              </h2>
              <ul className="mt-6 space-y-3">
                {whyChooseUsChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-cream/85">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-light" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/corporate/quote"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-cream/60 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-cream transition-colors duration-200 hover:bg-cream hover:text-olive-dark"
              >
                Know More
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-2xl">
              <Image
                src={yourBrandImage}
                alt="A gift box branded with a company logo"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </div>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
