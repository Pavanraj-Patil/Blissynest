import { Gift, type LucideIcon } from "lucide-react";

function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={`h-10 w-20 sm:h-12 sm:w-28 text-gold/70 ${flip ? "-scale-x-100" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M2 54C30 44 55 30 70 6" />
      <path d="M22 40C28 34 33 30 37 22" />
      <path d="M38 26C44 22 49 19 54 12" />
      <path d="M52 16C58 13 63 11 68 6" />
      <circle cx="70" cy="6" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="54" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="37" cy="22" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

type ShopBannerProps = {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
};

export function ShopBanner({ title, subtitle, icon: Icon = Gift }: ShopBannerProps) {
  return (
    <div
      className="relative flex items-center justify-center gap-3 sm:gap-6 bg-cream-dark border border-dashed border-gold/50 px-8 py-8 sm:py-10 text-center"
      style={{
        clipPath:
          "polygon(0% 0%, 100% 0%, 100% 42%, 94% 50%, 100% 58%, 100% 100%, 0% 100%, 0% 58%, 6% 50%, 0% 42%)",
      }}
    >
      <Sprig />
      <div className="max-w-xl">
        <h1 className="flex items-center justify-center gap-2 font-serif text-2xl sm:text-3xl text-charcoal">
          <Icon size={22} className="text-terracotta shrink-0" />
          {title}
        </h1>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">
          {subtitle}
        </p>
      </div>
      <Sprig flip />
    </div>
  );
}
