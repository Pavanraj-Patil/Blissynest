import { notFound } from "next/navigation";
import { isOccasionSlug } from "@/lib/occasion-data";

// Rejects unknown occasions before the loading skeleton streams, so a bad URL
// gets a real 404 status (see product/[slug]/layout.tsx for the why).
export default async function OccasionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ occasion: string }>;
}) {
  const { occasion } = await params;
  if (!isOccasionSlug(occasion)) notFound();
  return children;
}
