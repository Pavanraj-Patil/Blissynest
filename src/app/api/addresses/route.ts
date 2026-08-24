import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { toAddressDTO } from "@/lib/address-adapters";
import { addressInputSchema } from "@/lib/validations/address";

// GET /api/addresses — the signed-in user's saved addresses, oldest first
// (the account UI and checkout both treat the first one as "Default").
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ addresses: addresses.map(toAddressDTO) });
}

// POST /api/addresses — save a new address.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addressInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const address = await db.address.create({
    data: { ...parsed.data, userId: session.user.id },
  });
  return NextResponse.json({ address: toAddressDTO(address) }, { status: 201 });
}
