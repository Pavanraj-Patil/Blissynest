import { MapPin, CreditCard, Gift, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckoutStep = 1 | 2 | 3 | 4;

const steps: { step: CheckoutStep; icon: LucideIcon; title: string; subtitle: string }[] = [
  { step: 1, icon: MapPin, title: "Address", subtitle: "Delivery details" },
  { step: 2, icon: CreditCard, title: "Payment", subtitle: "Secure payment" },
  { step: 3, icon: Gift, title: "Review", subtitle: "Confirm your order" },
  { step: 4, icon: Check, title: "Complete", subtitle: "Order placed" },
];

export function CheckoutStepper({ current }: { current: CheckoutStep }) {
  return (
    <div className="flex items-center rounded-2xl border border-charcoal/10 bg-white px-5 py-5 sm:px-8">
      {steps.map((s, i) => {
        const done = s.step < current;
        const active = s.step === current;
        return (
          <div key={s.step} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                  done
                    ? "bg-olive text-cream"
                    : active
                      ? "bg-olive-dark text-cream"
                      : "bg-cream-dark text-charcoal/40"
                )}
              >
                <s.icon size={17} strokeWidth={1.75} />
              </span>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    done || active ? "text-charcoal" : "text-charcoal/40"
                  )}
                >
                  {s.title}
                </p>
                <p className="text-xs text-ink-muted">{s.subtitle}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-3 sm:mx-5 h-px flex-1",
                  done ? "bg-olive" : "bg-charcoal/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
