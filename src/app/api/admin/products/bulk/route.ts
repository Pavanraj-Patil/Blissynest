import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { firstIssueMessage } from "@/lib/validations/format-error";

const schema = z.object({
  action: z.enum(["PUBLISH", "DRAFT", "ARCHIVE"]),
  // The same filters the products list is showing — the action applies to
  // every product that matches them, not just the visible page.
  q: z.string().trim().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional().or(z.literal("").transform(() => undefined)),
  audience: z.enum(["HER", "HIM", "PARENTS", "COUPLES", "KIDS"]).optional().or(z.literal("").transform(() => undefined)),
  category: z.string().trim().optional(),
});

const statusForAction = { PUBLISH: "PUBLISHED", DRAFT: "DRAFT", ARCHIVE: "ARCHIVED" } as const;

// POST /api/admin/products/bulk — change the status of every product matching
// the list's current filters at once (e.g. archive the sample catalogue before
// launch). Nothing is deleted: archived products disappear from the store but
// stay in the admin, with their order history intact.
export async function POST(request: Request) {
  const check = await requireAdminApi("products");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }
  const { action, q, status, audience, category } = parsed.data;

  const where: Prisma.ProductWhereInput = {
    ...(q && { name: { contains: q } }),
    ...(status && { status }),
    ...(audience && { audience: { array_contains: audience } }),
    ...(category && { category: { array_contains: category } }),
  };

  const result = await db.product.updateMany({ where, data: { status: statusForAction[action] } });
  return NextResponse.json({ updated: result.count });
}
