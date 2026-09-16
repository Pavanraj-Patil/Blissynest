"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/lib/site-content-context";

export function ShopGiftBanner() {
  const { shopGiftBannerImage } = useSiteContent();
  const desktopImage = shopGiftBannerImage.desktop;
  const mobileImage = shopGiftBannerImage.mobile || shopGiftBannerImage.desktop;

  return (
    <div className="relative h-[260px] sm:h-[240px] md:h-[280px] w-full overflow-hidden rounded-3xl">
      <Image
        src={mobileImage}
        alt="A Blissynest gift box with a candle, mug, and dried flowers"
        fill
        className="object-cover object-[62%_center] sm:hidden"
        sizes="100vw"
      />
      <Image
        src={desktopImage}
        alt="A Blissynest gift box with a candle, mug, and dried flowers"
        fill
        className="hidden object-cover object-[62%_center] sm:block"
        sizes="1200px"
      />

      {/* Light scrim — just enough to guarantee text legibility regardless of
          what's behind it. The photo itself should already have genuine open,
          plain-toned space on its left third (see the generation prompt), so
          this only needs to be a soft assist, not a wall — a heavy opaque
          panel is what crushed the photo down to an invisible sliver before. */}
      <div
        className="absolute inset-0
          bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_30%,transparent_60%)]
          sm:bg-[linear-gradient(to_right,var(--color-cream)_0%,var(--color-cream)_25%,transparent_50%)]"
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
