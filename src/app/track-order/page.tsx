import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { TrackOrderClient } from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Blissynest",
  description: "Check the delivery status of your Blissynest order.",
};

export default function TrackOrderPage() {
  return (
    <>
      <TopBar />
      <TrackOrderClient />
    </>
  );
}
