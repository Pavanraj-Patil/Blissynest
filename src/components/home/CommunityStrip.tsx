import Image from "next/image";
import { getPageContent } from "@/lib/content-service";

type Photo = { image: string };

export async function CommunityStrip() {
  const content = await getPageContent("home");
  const section = content["community-strip"];
  const sectionTitle = section.sectionTitle as string;
  const eyebrow = section.eyebrow as string;
  const photos = section.photos as Photo[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          {sectionTitle}
        </h2>
        <p className="eyebrow text-terracotta-dark mt-2">
          {eyebrow}
        </p>
      </div>
      <div className="flex sm:grid sm:grid-cols-5 gap-3 md:gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative aspect-square w-[150px] sm:w-auto shrink-0 overflow-hidden rounded-2xl"
          >
            <Image
              src={p.image}
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
