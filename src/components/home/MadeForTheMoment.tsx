import { SectionHeader } from "@/components/ui/SectionHeader";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

type OccasionTile = { label: string; slug: string; image: string; icon: string; dark: boolean };

export async function MadeForTheMoment() {
  const content = await getPageContent("home");
  const section = content["made-for-the-moment"];
  const sectionTitle = section.sectionTitle as string;
  const tiles = section.tiles as OccasionTile[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <SectionHeader title={sectionTitle} linkLabel="See all occasions" linkHref="/occasions" />
      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {tiles.map((occ) => (
          <OccasionCard
            key={occ.label}
            label={occ.label}
            image={occ.image}
            icon={getContentIcon(occ.icon)}
            href={`/occasions/${occ.slug}`}
            dark={occ.dark}
          />
        ))}
      </div>
    </section>
  );
}
