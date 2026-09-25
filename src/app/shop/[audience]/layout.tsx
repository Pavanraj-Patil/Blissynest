import { notFound } from "next/navigation";
import { audienceSlugs } from "@/lib/shop-mock-data";

// Rejects unknown audiences before the loading skeleton streams, so a bad URL
// gets a real 404 status (see product/[slug]/layout.tsx for the why).
export default async function AudienceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  if (!(audienceSlugs as string[]).includes(audience)) notFound();
  return children;
}
