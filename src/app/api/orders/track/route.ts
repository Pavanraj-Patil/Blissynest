import { NextResponse } from "next/server";
import { getOrderForTracking } from "@/lib/order-service";

// GET /api/orders/track?orderNumber=&email= — public, no auth. Requires
// BOTH orderNumber and buyerEmail (case-insensitive) to match; returns the
// same generic error either way so it never confirms/denies an order
// number's existence to someone who doesn't know the email on it.
export async function GET(request: Request) {
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
