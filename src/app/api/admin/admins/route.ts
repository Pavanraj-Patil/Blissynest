import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminApi } from "@/lib/admin/require-admin";
import { setUserRoleAndPermissions } from "@/lib/admin/user-service";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { db } from "@/lib/db";

// POST /api/admin/admins — promotes an existing account (found by email) to
// ADMIN/SUPER_ADMIN with the given permissions. Deliberately doesn't create
// a new user — someone has to have signed up first, same as the original
// "sign up, then flip role in the DB" bootstrap story this app has always
// used, just done through the UI instead of Prisma Studio from here on.
const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  adminPermissions: z.array(z.enum(ADMIN_PERMISSIONS)).default([]),
});

export async function POST(request: Request) {
  const check = await requireSuperAdminApi();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json(
      { error: "No account with that email — they need to sign up first." },
      { status: 404 }
    );
  }
  if (user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "That account already has admin access." }, { status: 409 });
  }

  const result = await setUserRoleAndPermissions(
    user.id,
    parsed.data.role,
    parsed.data.adminPermissions,
    check.session.user.id!
  );
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
