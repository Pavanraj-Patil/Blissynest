import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { auth } from "@/auth";
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
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
