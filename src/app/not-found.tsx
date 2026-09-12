import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home, Heart, Gift, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Blissynest",
};

function FeatureItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-5 w-5 shrink-0 text-charcoal/60" strokeWidth={1.5} />
      <div className="text-left">
        <p className="text-xs font-semibold text-charcoal leading-tight">{title}</p>
        <p className="text-[11px] text-ink-muted leading-tight">{subtitle}</p>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream flex items-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-terracotta-light/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-olive-light/25 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-9 bg-charcoal/25" />
              <p className="eyebrow text-charcoal/60">Page Not Found</p>
              <span className="h-px w-9 bg-charcoal/25" />
            </div>

            <div className="mb-3 flex items-center justify-center font-serif text-6xl font-bold leading-none text-charcoal sm:text-7xl lg:justify-start lg:text-8xl">
              <span>4</span>
              <span
                className="relative mx-1 inline-flex h-[0.92em] w-[0.6em] items-center justify-center rounded-full border-charcoal"
                style={{ borderWidth: "0.09em" }}
              >
                <Heart className="h-[0.32em] w-[0.32em] fill-olive text-olive" strokeWidth={0} />
              </span>
              <span>4</span>
            </div>

            <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal lg:text-4xl">
              Oops! This page isn&apos;t here.
            </h1>

            <p className="mb-7 text-sm text-ink-muted lg:text-base">
              Looks like this page took a little detour. But don&apos;t worry,
              you can head back to where the good stuff is!
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-olive-dark px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-olive"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="mt-12 hidden items-center gap-6 lg:flex">
              <FeatureItem icon={Gift} title="Thoughtful Gifts" subtitle="for Every Occasion" />
              <span className="h-8 w-px bg-charcoal/15" />
              <FeatureItem icon={Heart} title="Make Moments" subtitle="More Special" />
              <span className="h-8 w-px bg-charcoal/15" />
              <FeatureItem icon={Home} title="Blissynest" subtitle="Always Here for You" />
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
            <Image
              src="/404-gift-scene.png"
              alt="A curious little bird peeking into an open gift box"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-bottom"
            />
          </div>

          <div className="flex items-center justify-center gap-4 lg:hidden">
            <FeatureItem icon={Gift} title="Thoughtful Gifts" subtitle="for Every Occasion" />
            <span className="h-8 w-px bg-charcoal/15" />
            <FeatureItem icon={Heart} title="Make Moments" subtitle="More Special" />
            <span className="h-8 w-px bg-charcoal/15" />
            <FeatureItem icon={Home} title="Blissynest" subtitle="Always Here for You" />
          </div>
        </div>
      </div>
    </main>
  );
}
