import { User, CalendarHeart, Gift, ArrowRight, ChevronDown } from "lucide-react";

const fields = [
  {
    label: "Who are you gifting?",
    icon: User,
    options: ["Her", "Him", "Parents", "Couple", "Friend", "Colleague"],
  },
  {
    label: "What's the occasion?",
    icon: CalendarHeart,
    options: [
      "Birthday",
      "Anniversary",
      "Wedding",
      "Housewarming",
      "Thank You",
    ],
  },
  {
    label: "Your budget?",
    icon: Gift,
    options: ["Under ₹1,000", "₹1,000–2,000", "₹2,000–5,000", "₹5,000+"],
  },
];

export function GiftingAssistant() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="relative z-10 -mt-6 sm:-mt-8 md:-mt-14 lg:-mt-20 mx-auto max-w-5xl rounded-3xl bg-white shadow-2xl shadow-charcoal/10 px-6 py-10 md:px-12 md:py-12">
        <div className="text-center mb-9">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">
            <span className="text-terracotta">✦</span> Not sure what to gift?{" "}
            <span className="text-terracotta">✦</span>
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Let our Gifting Assistant help you find the perfect match.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-4">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <label key={field.label} className="flex-1 min-w-0 block">
                <span className="eyebrow block text-[10px] text-charcoal-light mb-2">
                  {field.label}
                </span>
                <span className="relative flex items-center gap-2 rounded-xl border border-charcoal/15 bg-cream/60 px-3.5 py-3">
                  <Icon size={16} className="text-terracotta shrink-0" />
                  <select
                    defaultValue=""
                    className="w-full appearance-none bg-transparent text-sm text-charcoal focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="text-charcoal/40 shrink-0"
                  />
                </span>
              </label>
            );
          })}

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0 md:w-auto w-full">
            Find My Gift
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
