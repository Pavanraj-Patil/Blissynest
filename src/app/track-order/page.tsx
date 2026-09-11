import type { Metadata } from "next";
import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { getPageContent } from "@/lib/content-service";
import { TrackOrderClient } from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Blissynest",
  description: "Check the delivery status of your Blissynest order.",
};

export default async function TrackOrderPage() {
  const content = await getPageContent("track-order");

  return (
    <>
      <TopBar />
      <Suspense fallback={null}>
        <TrackOrderClient content={content.hero} />
      </Suspense>
    </>
  );
}
