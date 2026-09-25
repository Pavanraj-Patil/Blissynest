import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPageContent } from "@/lib/content-service";
import { EditCarousel, type EditTile } from "./EditCarousel";

export async function BlissynestEdit() {
  const content = await getPageContent("home");
  const section = content["blissynest-edit"];
  const sectionTitle = section.sectionTitle as string;
  const eyebrow = section.eyebrow as string;
  const description = section.description as string;
  const tiles = section.tiles as EditTile[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 md:pt-8 xl:pt-14">
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8 xl:mb-10">
        <div>
          {eyebrow && (
            <p className="eyebrow mb-2 text-terracotta-dark">{eyebrow}</p>
          )}
          <h2 className="font-serif text-2xl text-charcoal md:text-3xl xl:text-4xl">{sectionTitle}</h2>
          {description && (
            <p className="mt-2 max-w-md text-sm text-ink-muted xl:text-base">{description}</p>
          )}
        </div>
        <Link
          href="/collections"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal transition-colors hover:text-terracotta-dark sm:inline-flex"
        >
          Explore all
          <ArrowRight size={15} />
        </Link>
      </div>

      <EditCarousel tiles={tiles} />
    </section>
  );
}
