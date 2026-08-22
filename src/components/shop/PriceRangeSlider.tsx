type PriceRangeSliderProps = {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
};

export function PriceRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
}: PriceRangeSliderProps) {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-4 flex items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-charcoal/10" />
        <div
          className="absolute h-1 rounded-full bg-olive"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), valueMax - step);
            onChange(next, valueMax);
          }}
          className="range-thumb absolute inset-x-0 h-4 w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), valueMin + step);
            onChange(valueMin, next);
          }}
          className="range-thumb absolute inset-x-0 h-4 w-full"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex-1 rounded-lg border border-charcoal/15 px-3 py-2 text-xs text-charcoal-light">
          ₹ {valueMin.toLocaleString("en-IN")}
        </span>
        <span className="flex-1 rounded-lg border border-charcoal/15 px-3 py-2 text-xs text-charcoal-light">
          ₹ {valueMax >= max ? `${max.toLocaleString("en-IN")}+` : valueMax.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
