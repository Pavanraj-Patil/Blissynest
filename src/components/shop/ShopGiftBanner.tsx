import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const bannerImage =
  "https://placehold.co/1200x480/e3d3bd/2a2621.png?text=Blissynest+Gift+Box&font=playfair-display";

export function ShopGiftBanner() {
  return (
    <div className="relative h-[260px] sm:h-[240px] md:h-[280px] w-full overflow-hidden rounded-3xl">
      <Image
        src={bannerImage}
        alt="A Blissynest gift box with a candle, mug, and dried flowers"
        fill
        className="object-cover object-[72%_center]"
        sizes="(min-width: 1024px) 1200px, 100vw"
      />

      {/* Scrim: opaque cream on the left for text legibility, fading out to reveal the photo on the right */}
      <div
        className="absolute inset-0
          bg-[linear-gradient(to_right,var(--color-cream-dark)_0%,var(--color-cream-dark)_75%,transparent_98%)]
          sm:bg-[linear-gradient(to_right,var(--color-cream-dark)_0%,var(--color-cream-dark)_52%,transparent_82%)]"
      />

      <div className="relative h-full flex items-center px-6 sm:px-10">
        <div className="max-w-[13rem] sm:max-w-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
            Not sure what to gift?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-ink-muted">
            Let our Gifting Assistant help you find the perfect match.
          </p>
          <Button href="/gifting-assistant" variant="primary" className="mt-5">
            Find My Gift
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
