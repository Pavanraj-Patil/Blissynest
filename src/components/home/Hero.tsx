import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { heroImage } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pt-10 md:pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="lg:pt-6">
          <p className="text-gold text-sm mb-4 tracking-widest">❧❧❧❧</p>
          <h1 className="font-serif text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-charcoal">
            For every feeling
            <br />
            worth celebrating.
          </h1>
          <p className="mt-5 text-ink-muted text-base sm:text-lg max-w-md leading-relaxed">
            Thoughtfully curated gifts for the people who make life
            beautiful.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/gifting-assistant" variant="primary">
              Find the Perfect Gift
            </Button>
            <Button href="/collections" variant="outline">
              Explore Collections
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[10/7] w-full overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src={heroImage}
              alt="An open Blissynest gift box with a candle, mug, card, and blanket"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
