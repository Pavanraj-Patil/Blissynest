import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createReview } from "@/lib/review-service";
import { createReviewSchema } from "@/lib/validations/review";

// POST /api/reviews — a customer reviewing a product from one of their own
// orders. Starts at status PENDING; see src/app/admin/reviews for
// moderation. See review-service.ts for why this doesn't gate on the order
// being DELIVERED.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await createReview(session.user.id, parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
