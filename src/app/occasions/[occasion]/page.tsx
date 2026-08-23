import type { Metadata } from "next";
import { occasionContent, isOccasionSlug } from "@/lib/occasion-data";
import { OccasionPageClient } from "./OccasionPageClient";

type Props = {
  params: Promise<{ occasion: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { occasion } = await params;

  if (!isOccasionSlug(occasion)) {
    return { title: "Occasions | Blissynest" };
  }

  const content = occasionContent[occasion];
  return {
    title: `${content.title} | Blissynest`,
    description: content.subtitle,
  };
}

export default function OccasionPage({ params }: Props) {
  return <OccasionPageClient params={params} />;
}
