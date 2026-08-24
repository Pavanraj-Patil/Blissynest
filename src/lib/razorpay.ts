import crypto from "crypto";

// Raw fetch against Razorpay's REST API — no SDK dependency, matches the
// pattern used elsewhere in this codebase (see src/app/api/products'
// comments on server-trusted computation). Razorpay's Orders/Payments API
// has been stable for years, so this is safe to hand-roll rather than pull
// in a whole SDK for a handful of endpoints.

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export function isRazorpayConfigured(): boolean {
  return Boolean(KEY_ID && KEY_SECRET);
}

export function getRazorpayKeyId(): string {
  if (!KEY_ID) throw new Error("RAZORPAY_KEY_ID is not set");
  return KEY_ID;
}

function authHeader(): string {
  return "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string | null;
  status: string;
};

// amount is in paise, matching how every other price in this app is
// stored — no conversion needed at the boundary.
export async function createRazorpayOrder(params: {
  amount: number;
  receipt: string;
  currency?: string;
}): Promise<RazorpayOrder> {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency ?? "INR",
      receipt: params.receipt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order creation failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export async function getRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  const res = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Razorpay order (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

function timingSafeEqualHex(expectedHex: string, actualHex: string): boolean {
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

// Verifies the HMAC Razorpay's Checkout.js handler callback returns —
// proves razorpay_payment_id genuinely belongs to razorpay_order_id and
// wasn't forged client-side. Documented at
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#step-5-verify-payment-signature
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  try {
    return timingSafeEqualHex(expected, params.signature);
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  try {
    return timingSafeEqualHex(expected, signature);
  } catch {
    return false;
  }
}
