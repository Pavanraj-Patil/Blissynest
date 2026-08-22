import { Gift, PackageCheck, Wand2, Truck } from "lucide-react";
import { featureStrip } from "@/lib/mock-data";

const icons = [Gift, PackageCheck, Wand2, Truck];

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-b border-charcoal/10 py-8">
        {featureStrip.map((f, i) => {
          const Icon = icons[i];
          return (
            <div key={f.title} className="flex items-start gap-3">
              <Icon size={24} strokeWidth={1.5} className="text-terracotta shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  {f.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {f.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
