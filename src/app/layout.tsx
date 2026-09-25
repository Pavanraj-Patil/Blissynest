import type { Metadata, Viewport } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { TopProgress } from "@/components/layout/TopProgress";
import { auth } from "@/auth";
import { getPageContent, getSectionVisibility } from "@/lib/content-service";
import type { ResponsiveImageValue } from "@/lib/content-schema";
import { getSiteUrl, isIndexingAllowed } from "@/lib/site-url";
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

// viewportFit "cover" lets the page draw under the notch / home indicator so
// env(safe-area-inset-*) works — the sticky bottom bars use it to stay clear
// of the iPhone home indicator. themeColor tints the mobile browser chrome.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f3ec",
};

const siteTitle = "Blissynest — Gifts That Feel Like Home";
const siteDescription = "Thoughtfully curated gifts for the people who make life beautiful.";

export const metadata: Metadata = {
  // Makes every relative URL below (share images, canonical links) absolute.
  metadataBase: new URL(getSiteUrl()),
  // Off everywhere except the live site — see isIndexingAllowed().
  robots: isIndexingAllowed() ? { index: true, follow: true } : { index: false, follow: false },
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/favicon.png",
  },
  // Default social-share card; individual pages (products) override it.
  openGraph: {
    type: "website",
    siteName: "Blissynest",
    locale: "en_IN",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Blissynest gift box" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-default.jpg"],
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
        {/* Needs Suspense because it reads the URL's query string. */}
        <Suspense fallback={null}>
          <TopProgress />
        </Suspense>
        <AppProviders
          session={session}
          shopGiftBannerImage={shopGiftBannerImage}
          categoryPillImages={categoryPillImages}
          shopGiftBannerVisible={layoutVisibility["shop-gift-banner"]}
          footer={{
            newsletterHeading: layoutContent.footer.newsletterHeading as string,
            newsletterSubcopy: layoutContent.footer.newsletterSubcopy as string,
            instagramUrl: layoutContent.footer.instagramUrl as string,
            facebookUrl: layoutContent.footer.facebookUrl as string,
            pinterestUrl: layoutContent.footer.pinterestUrl as string,
            youtubeUrl: layoutContent.footer.youtubeUrl as string,
          }}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
