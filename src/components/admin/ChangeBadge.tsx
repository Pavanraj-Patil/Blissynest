import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChangeBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-xs font-medium text-ink-muted">New</span>;
  }
  if (pct === 0) {
    return <span className="text-xs font-medium text-ink-muted">No change</span>;
  }
  const up = pct > 0;
  return (
    <span
      title="Compared with the previous period of the same length"
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        up ? "text-olive-dark" : "text-terracotta-dark"
      )}
    >
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {Math.abs(pct) > 999 ? "999%+" : `${Math.abs(pct)}%`}
    </span>
  );
}
