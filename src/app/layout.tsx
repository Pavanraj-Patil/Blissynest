import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { auth } from "@/auth";
import { getPageContent, getSectionVisibility } from "@/lib/content-service";
import type { ResponsiveImageValue } from "@/lib/content-schema";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blissynest — Gifts That Feel Like Home",
  description:
    "Thoughtfully curated gifts for the people who make life beautiful.",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [session, layoutContent, layoutVisibility] = await Promise.all([
    auth(),
    getPageContent("layout"),
    getSectionVisibility("layout"),
  ]);
  const shopGiftBannerImage = layoutContent["shop-gift-banner"].image as ResponsiveImageValue;
  const categoryPillImages = layoutContent["category-pills"] as Record<string, string>;

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        <AppProviders
          session={session}
          shopGiftBannerImage={shopGiftBannerImage}
          categoryPillImages={categoryPillImages}
          shopGiftBannerVisible={layoutVisibility["shop-gift-banner"]}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
