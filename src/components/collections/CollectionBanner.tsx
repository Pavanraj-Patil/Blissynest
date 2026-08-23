import Image from "next/image";
import { cn } from "@/lib/cn";

type CollectionBannerProps = {
  title: string;
  subtitle: string;
  image: string;
  bg: string;
  dark?: boolean;
};

export function CollectionBanner({
  title,
  subtitle,
  image,
  bg,
  dark = false,
}: CollectionBannerProps) {
  return (
    <div className="rounded-3xl overflow-hidden border border-charcoal/10">
      <div className="flex flex-col sm:flex-row">
        <div
          className="hidden sm:flex sm:w-[38%] shrink-0 items-center px-8 lg:px-10 py-10"
          style={{ backgroundColor: `#${bg}` }}
        >
          <div>
            <h1
              className={cn(
                "font-serif text-3xl leading-tight",
                dark ? "text-cream" : "text-charcoal"
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mt-2 text-sm",
                dark ? "text-cream/75" : "text-ink-muted"
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div className="relative h-56 sm:h-64 sm:flex-1">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
          <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-transparent" />
          <div className="sm:hidden absolute inset-x-0 top-0 p-6">
            <h1 className="font-serif text-2xl text-cream leading-tight">
              {title}
            </h1>
            <p className="mt-1 text-xs text-cream/85">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
