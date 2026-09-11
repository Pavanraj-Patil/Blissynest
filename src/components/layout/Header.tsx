import Image from "next/image";
import Link from "next/link";
import { NavDropdown, type NavDropdownItem } from "./NavDropdown";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";
import {
  audienceSlugs,
  audienceShopContent,
} from "@/lib/shop-mock-data";
import { audiencePillIcons, occasionSlugs, occasionContent } from "@/lib/occasion-data";
import { collectionSlugs, collectionContent } from "@/lib/collection-mock-data";

const shopItems: NavDropdownItem[] = audienceSlugs.map((slug) => ({
  label: audienceShopContent[slug].title,
  href: `/shop/${slug}`,
  icon: audiencePillIcons[slug],
}));

const personalisedItems: NavDropdownItem[] = audienceSlugs.map((slug) => ({
  label: audienceShopContent[slug].title,
  href: `/shop/${slug}?category=personalised`,
  icon: audiencePillIcons[slug],
}));

const collectionItems: NavDropdownItem[] = collectionSlugs.map((slug) => ({
  label: collectionContent[slug].title,
  href: `/collections/${slug}`,
  swatch: collectionContent[slug].bg,
}));

const occasionItems: NavDropdownItem[] = occasionSlugs.map((slug) => ({
  label: occasionContent[slug].label,
  href: `/occasions/${slug}`,
  icon: occasionContent[slug].icon,
}));

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-20 xl:h-24 flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <MobileNav />
          <Link href="/" className="shrink-0">
            {/* Icon mark only below 380px and again through the md-to-xl
                tablet/small-laptop band, where the full wordmark is too wide
                to share a row with the nav — see NavDropdown/HeaderActions
                widths this has to fit alongside. */}
            <Image
              src="/mini_logo.png"
              alt="Blissynest"
              width={64}
              height={64}
              priority
              className="block h-9 w-9 min-[380px]:hidden md:block xl:hidden"
            />
            <Image
              src="/blissynest-logo.png"
              alt="Blissynest"
              width={210}
              height={42}
              priority
              className="hidden h-8 w-auto min-[380px]:block md:hidden xl:block xl:h-11"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-3 xl:gap-8 text-[12px] xl:text-[13px] font-medium tracking-wide text-charcoal">
          <NavDropdown label="Shop" href="/shop" items={shopItems} columns={2} />
          <NavDropdown label="Collections" href="/collections" items={collectionItems} />
          <NavDropdown label="Occasions" href="/occasions" items={occasionItems} columns={2} />
          <NavDropdown label="Personalised" href="/personalised" items={personalisedItems} columns={2} />
          <Link
            href="/corporate"
            className="flex items-center gap-1.5 hover:text-terracotta-dark transition-colors uppercase"
          >
            Corporate
            <span className="hidden xl:inline rounded-full bg-terracotta text-cream text-[9px] font-semibold px-1.5 py-0.5 tracking-normal normal-case">
              New
            </span>
          </Link>
        </nav>

        <HeaderActions />
      </div>
    </header>
  );
}
