import { Cake, Heart, Gem, Home, Mail, Sparkles, Flame } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { occasions } from "@/lib/mock-data";

const icons = [Cake, Heart, Gem, Home, Mail, Sparkles, Flame];

export function MadeForTheMoment() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 md:py-8">
      <SectionHeader title="Made for the moment" linkLabel="See all occasions" />
      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {occasions.map((occ, i) => (
          <OccasionCard
            key={occ.label}
            label={occ.label}
            image={occ.image}
            icon={icons[i]}
            dark={occ.label === "Festivals"}
          />
        ))}
      </div>
    </section>
  );
}
