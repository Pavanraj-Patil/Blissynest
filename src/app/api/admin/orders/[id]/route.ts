import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { updateOrderAdmin } from "@/lib/admin/order-service";
import { updateOrderSchema } from "@/lib/validations/admin-order";
import { firstIssueMessage } from "@/lib/validations/format-error";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requireAdminApi("orders");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const result = await updateOrderAdmin(id, parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
