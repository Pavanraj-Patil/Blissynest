import { notFound } from "next/navigation";
import { db } from "@/lib/db";

// Checks the product exists BEFORE the page starts streaming. The route has a
// loading skeleton (loading.tsx), and once a skeleton has been sent the HTTP
// status is already 200 — so a missing or archived product would show a
// "not found" screen but tell Google "200 OK". Deciding here, ahead of the
// skeleton, keeps a real 404 for bad links.
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { status: true } });
  if (!product || product.status !== "PUBLISHED") notFound();
  return children;
}
