import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateNotificationsSchema } from "@/lib/validations/account";
import { firstIssueMessage } from "@/lib/validations/format-error";

// PATCH /api/account/notifications — updates the signed-in user's
// notification preferences.
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateNotificationsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const { orders, promos, recs } = parsed.data;
  await db.user.update({
    where: { id: session.user.id },
    data: { notifyOrders: orders, notifyPromos: promos, notifyRecs: recs },
  });

  return NextResponse.json({ success: true });
}
