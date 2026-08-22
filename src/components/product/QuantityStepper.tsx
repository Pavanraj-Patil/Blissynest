import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-charcoal/15">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center text-charcoal disabled:text-charcoal/25 hover:bg-cream-dark transition-colors rounded-l-xl"
      >
        <Minus size={15} />
      </button>
      <span className="w-10 text-center text-sm font-medium text-charcoal">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center text-charcoal disabled:text-charcoal/25 hover:bg-cream-dark transition-colors rounded-r-xl"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
