import { Gift, PackageCheck, Truck, ShieldCheck } from "lucide-react";

const featureItems = [
  { icon: Gift, title: "Thoughtfully Curated", subtitle: "Every product earns its place." },
  { icon: PackageCheck, title: "Premium Packaging", subtitle: "Beautiful inside and out." },
  { icon: Truck, title: "Delivered with Care", subtitle: "Reliable delivery, across India." },
  { icon: ShieldCheck, title: "Happiness Guaranteed", subtitle: "We're here to make it right." },
];

export function StandardFeatureStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-charcoal/10 pt-10">
      {featureItems.map((f) => (
        <div key={f.title} className="flex items-start gap-3">
          <f.icon size={24} strokeWidth={1.5} className="text-terracotta shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-charcoal">{f.title}</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">{f.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
