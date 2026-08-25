import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { heroImage, heroImageMobile } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative h-[440px] sm:h-[520px] md:h-[560px] lg:h-[620px] w-full overflow-hidden">
      <Image
        src={heroImageMobile}
        alt="An open Blissynest gift box with a candle, mug, card, and blanket, surrounded by dried flowers"
        fill
        priority
        className="block md:hidden object-cover object-center"
        sizes="100vw"
      />
      <Image
        src={heroImage}
        alt="An open Blissynest gift box with a candle, mug, card, and blanket, surrounded by dried flowers"
        fill
        priority
        className="hidden md:block object-cover object-[68%_center]"
        sizes="100vw"
      />

      <div className="relative h-full mx-auto max-w-[1440px] px-4 md:px-8 flex items-end pb-10 md:pb-20 lg:pb-28">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
          <Button
            href="/gifting-assistant"
            variant="primary"
            className="px-5 py-2.5 text-[10px] sm:px-7 sm:py-3.5 sm:text-xs"
          >
            Find the Perfect Gift
          </Button>
          <Button
            href="/collections"
            variant="dark"
            className="px-5 py-2.5 text-[10px] sm:px-7 sm:py-3.5 sm:text-xs"
          >
            Explore Collections
          </Button>
        </div>
      </div>
    </section>
  );
}
