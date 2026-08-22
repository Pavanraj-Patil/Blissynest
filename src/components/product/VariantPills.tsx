import { cn } from "@/lib/cn";

type VariantPillsProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

export function VariantPills({
  label,
  options,
  selected,
  onSelect,
}: VariantPillsProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-charcoal mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={selected === option}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              selected === option
                ? "border-olive bg-olive text-cream"
                : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
