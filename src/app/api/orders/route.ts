import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrdersForUser, createOrderForUser } from "@/lib/order-service";
import { createOrderSchema } from "@/lib/validations/order";

// GET /api/orders — the signed-in user's order history.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await getOrdersForUser(session.user.id) });
}

// POST /api/orders — places a real order from the signed-in user's server
// cart. Guest checkout isn't wired up yet (see CheckoutPageClient's auth
// gate) — every order created here always has a real userId.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await createOrderForUser(session.user.id, parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
