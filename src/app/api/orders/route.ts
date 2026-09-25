import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrdersForUser, createOrder, resolveCartSourceForRequest } from "@/lib/order-service";
import { createOrderSchema } from "@/lib/validations/order";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

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

  // Keyed by user id when signed in, by IP for guest checkout — caps
  // automated order spam / repeated checkout submissions either way.
  const limitKey = session?.user?.id
    ? `orders-create:user:${session.user.id}`
    : `orders-create:ip:${getClientIp(request)}`;
  const limit = checkRateLimit(limitKey, 10, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
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
