import type { Metadata } from "next";
import { GiftingAssistantPageClient } from "./GiftingAssistantPageClient";

export const metadata: Metadata = {
  title: "Gifting Assistant | Blissynest",
  description: "Tell us who you're gifting and we'll help you find the perfect match.",
};

export default function GiftingAssistantPage() {
  return <GiftingAssistantPageClient />;
}
