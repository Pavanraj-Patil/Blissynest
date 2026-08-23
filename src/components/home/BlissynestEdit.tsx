import { SectionHeader } from "@/components/ui/SectionHeader";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { editCollections } from "@/lib/mock-data";

export function BlissynestEdit() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 md:py-8">
      <SectionHeader title="The Blissynest Edit" eyebrow="Curated Collections" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {editCollections.map((c) => (
          <CollectionCard
            key={c.title}
            title={c.title}
            subtitle={c.subtitle}
            image={c.image}
            href={`/collections/${c.slug}`}
            dark={c.title === "The Luxury Edit"}
          />
        ))}
      </div>
    </section>
  );
}
