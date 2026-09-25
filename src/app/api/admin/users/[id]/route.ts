import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminApi } from "@/lib/admin/require-admin";
import { setUserRoleAndPermissions } from "@/lib/admin/user-service";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { firstIssueMessage } from "@/lib/validations/format-error";

// Managing another user's admin role/permissions is exclusively a
// super-admin action — see the comment on requireSuperAdmin.
const bodySchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"]),
  adminPermissions: z.array(z.enum(ADMIN_PERMISSIONS)).default([]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requireSuperAdminApi();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const result = await setUserRoleAndPermissions(
    id,
    parsed.data.role,
    parsed.data.adminPermissions,
    check.session.user.id!
  );
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
