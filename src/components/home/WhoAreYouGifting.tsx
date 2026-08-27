import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { getPageContent } from "@/lib/content-service";

type Tile = { label: string; href: string; image: string };

export async function WhoAreYouGifting() {
  const content = await getPageContent("home");
  const section = content["who-are-you-gifting"];
  const sectionTitle = section.sectionTitle as string;
  const tiles = section.tiles as Tile[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pt-2 md:pt-3 pb-4 md:pb-6">
      <SectionHeader title={sectionTitle} linkHref="/shop" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {tiles.map((tile) => (
          <CategoryCard
            key={tile.label}
            label={tile.label}
            image={tile.image}
            href={tile.href}
          />
        ))}
      </div>
    </section>
  );
}
