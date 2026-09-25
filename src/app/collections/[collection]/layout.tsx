import { notFound } from "next/navigation";
import { isCollectionSlug } from "@/lib/collection-mock-data";

// Rejects unknown collections before the loading skeleton streams, so a bad
// URL gets a real 404 status (see product/[slug]/layout.tsx for the why).
export default async function CollectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isCollectionSlug(collection)) notFound();
  return children;
}
