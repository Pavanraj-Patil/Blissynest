import { cn } from "@/lib/cn";

type PerfectForTagsProps = {
  tags: string[];
};

export function PerfectForTags({ tags }: PerfectForTagsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-charcoal mb-3">Perfect For</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium",
              i === 0
                ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                : "border-charcoal/15 text-charcoal-light"
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
