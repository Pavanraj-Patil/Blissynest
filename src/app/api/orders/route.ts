import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrdersForUser, createOrder, resolveCartSourceForRequest } from "@/lib/order-service";
import { createOrderSchema } from "@/lib/validations/order";

// GET /api/orders — the signed-in user's order history.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await getOrdersForUser(session.user.id) });
}

// POST /api/orders — places a real order, either from the signed-in user's
// server cart or, if there's no session, from a guest's client-submitted
// cart (see resolveCartSourceForRequest).
export async function POST(request: Request) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const source = resolveCartSourceForRequest(session, parsed.data);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  const result = await createOrder(source, parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
