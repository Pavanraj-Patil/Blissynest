import { SectionHeader } from "@/components/ui/SectionHeader";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { getPageContent } from "@/lib/content-service";

type CollectionTile = { title: string; subtitle: string; slug: string; image: string; dark: boolean };

export async function BlissynestEdit() {
  const content = await getPageContent("home");
  const section = content["blissynest-edit"];
  const sectionTitle = section.sectionTitle as string;
  const eyebrow = section.eyebrow as string;
  const tiles = section.tiles as CollectionTile[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <SectionHeader title={sectionTitle} eyebrow={eyebrow} linkHref="/collections" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {tiles.map((c) => (
          <CollectionCard
            key={c.title}
            title={c.title}
            subtitle={c.subtitle}
            image={c.image}
            href={`/collections/${c.slug}`}
            dark={c.dark}
          />
        ))}
      </div>
    </section>
  );
}
