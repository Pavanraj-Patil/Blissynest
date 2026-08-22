import { CheckCircle2 } from "lucide-react";

type WhyYoullLoveItProps = {
  items: string[];
};

export function WhyYoullLoveIt({ items }: WhyYoullLoveItProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-charcoal mb-3">
        Why They&rsquo;ll Love It
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal-light">
            <CheckCircle2 size={16} className="text-olive shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
