import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products/:slug — full PDP detail. Replaces getProductBySlug()'s
// mock lookup (src/lib/product-mock-data.ts) once the PDP is wired to this;
// unlike that function, there's no generated-fallback path here — every
// product in the real catalogue is a real row, not a synthesized shape.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await db.product.findUnique({ where: { slug } });

  if (!product || product.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
