import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validations/account";

// PATCH /api/account/profile — updates the signed-in user's name, email,
// and phone. No re-verification step for email changes, matching this
// app's existing signup flow (see auth.config.ts), which doesn't verify
// email either.
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { name, email, phone } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json(
      { error: "That email is already in use by another account.", field: "email" },
      { status: 409 }
    );
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: { name, email, phone },
    select: { name: true, email: true, phone: true },
  });

  return NextResponse.json({ user });
}
