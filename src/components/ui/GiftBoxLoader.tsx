import { cn } from "@/lib/cn";

// The brand's loading mark: a gift box whose lid lifts while sparkles rise.
// Pure CSS/SVG — no animation library or downloaded file. Meant for waits
// that matter (placing an order, taking a payment, a page that's slow to
// open). Screen readers hear `label`; the animation stops for visitors who
// ask their device for reduced motion.
export function GiftBoxLoader({
  label = "Wrapping things up…",
  hint,
  size = 96,
  className,
}: {
  label?: string;
  hint?: string;
  size?: number;
  className?: string;
}) {
  const s = size / 96;
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center text-center", className)}>
      <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
        <div className="absolute rounded bg-olive" style={{ left: 14 * s, bottom: 4 * s, width: 68 * s, height: 44 * s }} />
        <div className="absolute bg-terracotta" style={{ left: 41 * s, bottom: 4 * s, width: 14 * s, height: 44 * s }} />
        <div
          className="gb-lid absolute rounded bg-olive-dark"
          style={{ left: 8 * s, bottom: 46 * s, width: 80 * s, height: 16 * s }}
        >
          <div className="absolute bg-terracotta" style={{ left: 33 * s, top: 0, width: 14 * s, height: 16 * s }} />
          <div
            className="absolute border-terracotta"
            style={{
              left: 24 * s,
              top: -12 * s,
              width: 14 * s,
              height: 14 * s,
              borderWidth: 3 * s,
              borderStyle: "solid",
              borderRadius: `${14 * s}px ${14 * s}px ${2 * s}px ${14 * s}px`,
              transform: "rotate(-20deg)",
            }}
          />
          <div
            className="absolute border-terracotta"
            style={{
              left: 42 * s,
              top: -12 * s,
              width: 14 * s,
              height: 14 * s,
              borderWidth: 3 * s,
              borderStyle: "solid",
              borderRadius: `${14 * s}px ${14 * s}px ${14 * s}px ${2 * s}px`,
              transform: "rotate(20deg)",
            }}
          />
        </div>
        <div className="gb-spark absolute rounded-full bg-gold" style={{ left: 36 * s, top: 18 * s, width: 8 * s, height: 8 * s }} />
        <div
          className="gb-spark absolute rounded-full bg-gold"
          style={{ left: 58 * s, top: 26 * s, width: 6 * s, height: 6 * s, animationDelay: "0.3s" }}
        />
      </div>
      <p className="mt-2 font-serif text-base text-charcoal">{label}</p>
      {hint && <p className="mt-1 max-w-xs text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
