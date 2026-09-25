import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { toAddressDTO } from "@/lib/address-adapters";
import { addressInputSchema } from "@/lib/validations/address";
import { firstIssueMessage } from "@/lib/validations/format-error";

// PATCH /api/addresses/:id — update one of the signed-in user's addresses.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = addressInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  // updateMany + a userId filter (rather than update-by-id) so a request
  // for someone else's address id quietly matches zero rows instead of
  // leaking whether that id exists.
  const result = await db.address.updateMany({
    where: { id, userId: session.user.id },
    data: parsed.data,
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  const address = await db.address.findUnique({ where: { id } });
  return NextResponse.json({ address: toAddressDTO(address!) });
}

// DELETE /api/addresses/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.address.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
