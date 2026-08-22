import Image from "next/image";
import { communityPhotos } from "@/lib/mock-data";

export function CommunityStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          From our community
        </h2>
        <p className="eyebrow text-terracotta-dark mt-2">
          Real moments, real smiles
        </p>
      </div>
      <div className="flex sm:grid sm:grid-cols-5 gap-3 md:gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {communityPhotos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square w-[150px] sm:w-auto shrink-0 overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt="Customer moment with a Blissynest gift"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 19vw, 45vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
