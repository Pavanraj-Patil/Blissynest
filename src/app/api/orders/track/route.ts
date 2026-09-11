import { NextResponse } from "next/server";
import { getOrderForTracking } from "@/lib/order-service";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

// GET /api/orders/track?orderNumber=&email= — public, no auth. Requires
// BOTH orderNumber and buyerEmail (case-insensitive) to match; returns the
// same generic error either way so it never confirms/denies an order
// number's existence to someone who doesn't know the email on it.
export async function GET(request: Request) {
  // No auth on this route, so IP is the only available key — still worth
  // having, since order numbers (BLS + timestamp digits) aren't
  // high-entropy and this endpoint returns a real name/address/items.
  const limit = checkRateLimit(`orders-track:${getClientIp(request)}`, 15, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const email = searchParams.get("email")?.trim();
  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order number and email are required." }, { status: 400 });
  }

  const order = await getOrderForTracking(orderNumber, email);
  if (!order) {
    return NextResponse.json({ error: "We couldn't find an order matching those details." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
