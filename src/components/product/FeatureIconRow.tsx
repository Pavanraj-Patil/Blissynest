import { getIcon } from "./icon-map";

type FeatureIconRowProps = {
  items: { icon: string; label: string }[];
};

export function FeatureIconRow({ items }: FeatureIconRowProps) {
  // The admin form has no field to set benefits yet, so any admin-created
  // product has an empty array here — render nothing rather than a blank
  // bordered box.
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-charcoal/10 px-4 py-4">
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <div key={item.label} className="flex items-center gap-2">
            {Icon && <Icon size={18} strokeWidth={1.5} className="text-terracotta shrink-0" />}
            <span className="text-xs text-charcoal-light leading-tight">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
