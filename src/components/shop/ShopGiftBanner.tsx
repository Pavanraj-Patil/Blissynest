import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const bannerImage =
  "https://placehold.co/640x420/e3d3bd/2a2621.png?text=Blissynest+Gift+Box&font=playfair-display";

export function ShopGiftBanner() {
  return (
    <div className="rounded-3xl bg-cream-dark overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6 sm:gap-10">
        <div className="px-6 py-8 sm:pl-10 sm:py-10">
          <h2 className="font-serif text-2xl text-charcoal">
            Not sure what to gift?
          </h2>
          <p className="mt-2 text-sm text-ink-muted max-w-sm">
            Let our Gifting Assistant help you find the perfect match.
          </p>
          <Button href="/gifting-assistant" variant="primary" className="mt-6">
            Find My Gift
            <ArrowRight size={14} />
          </Button>
        </div>
        <div className="relative h-48 sm:h-56 w-full sm:w-96 shrink-0">
          <Image
            src={bannerImage}
            alt="A Blissynest gift box with a candle, mug, and dried flowers"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 24rem, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
