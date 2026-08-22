import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { heroImage } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative h-[440px] sm:h-[520px] md:h-[560px] lg:h-[620px] w-full overflow-hidden">
      <Image
        src={heroImage}
        alt="An open Blissynest gift box with a candle, mug, card, and blanket, surrounded by dried flowers"
        fill
        priority
        className="object-cover object-[68%_center]"
        sizes="100vw"
      />

      {/* Scrim: opaque cream on the left for text legibility, fading out to reveal the photo on the right */}
      <div
        className="absolute inset-0
          bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_88%,transparent_100%)]
          sm:bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_62%,transparent_92%)]
          md:bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_48%,transparent_75%)]
          lg:bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_38%,transparent_62%)]"
      />

      <div className="relative h-full mx-auto max-w-[1440px] px-4 md:px-8 flex items-start pt-12 sm:items-center sm:pt-0">
        <div className="max-w-[18rem] sm:max-w-sm lg:max-w-lg">
          <p className="text-gold text-sm mb-4 tracking-widest">❧❧❧❧</p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.15] sm:leading-[1.08] text-charcoal">
            For every feeling
            <br />
            worth celebrating.
          </h1>
          <p className="mt-5 text-charcoal-light text-sm sm:text-lg leading-relaxed">
            Thoughtfully curated gifts for the people who make life
            beautiful.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <Button href="/gifting-assistant" variant="primary">
              Find the Perfect Gift
            </Button>
            <Button href="/collections" variant="outline">
              Explore Collections
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
