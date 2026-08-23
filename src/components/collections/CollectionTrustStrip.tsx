import { Sparkles, BadgeCheck, Leaf, Gift } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Handpicked", subtitle: "Thoughtful picks for you" },
  { icon: BadgeCheck, title: "Quality First", subtitle: "Premium, tested & trusted" },
  { icon: Leaf, title: "Sustainable", subtitle: "Conscious choices we love" },
  { icon: Gift, title: "Beautifully Packaged", subtitle: "Ready to gift, every time" },
];

export function CollectionTrustStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <item.icon size={22} strokeWidth={1.5} className="text-terracotta shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-charcoal">{item.title}</h3>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
