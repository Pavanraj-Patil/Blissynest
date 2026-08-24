import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { moderateReview } from "@/lib/review-service";
import { moderateReviewSchema } from "@/lib/validations/review";

// PATCH /api/admin/reviews/:id — approve or reject a pending review.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requireAdminApi();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = moderateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await moderateReview(id, parsed.data.status);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
