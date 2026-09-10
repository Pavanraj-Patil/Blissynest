import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateNotificationsSchema } from "@/lib/validations/account";

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
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
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
