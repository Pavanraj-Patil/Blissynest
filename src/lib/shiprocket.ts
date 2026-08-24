// Raw fetch against Shiprocket's REST API, same reasoning as src/lib/razorpay.ts.
// Auth token is cached in-memory for the life of the Node process — same
// "not multi-instance-safe, documented" tradeoff as src/lib/rate-limit.ts;
// fine for a single-instance deployment, would need a shared cache (Redis)
// behind a load balancer.

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

export function isShiprocketConfigured(): boolean {
  return Boolean(SHIPROCKET_EMAIL && SHIPROCKET_PASSWORD);
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Shiprocket auth failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();

  // Shiprocket tokens are valid ~10 days; refresh a little early to be safe.
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return cachedToken.token;
}

export type ShiprocketOrderInput = {
  orderNumber: string;
  createdAt: Date;
  paymentMethod: "COD" | "CARD" | "UPI" | "NETBANKING";
  subtotal: number; // paise
  total: number; // paise
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  items: { productName: string; quantity: number; unitPrice: number; productId: string | null }[];
};

function toRupees(paise: number): number {
  return Math.round(paise / 100);
}

// Every product on this catalogue is a small gift item — real per-product
// weight/dimensions aren't tracked yet (see prisma/schema.prisma Product
// model), so this uses one conservative default for every shipment rather
// than fabricating precise-looking numbers. Revisit once the catalogue has
// real fulfillment data.
const DEFAULT_PACKAGE = { length: 15, breadth: 12, height: 8, weight: 0.5 };

export async function createShiprocketOrder(
  order: ShiprocketOrderInput
): Promise<{ shipmentId: number; shiprocketOrderId: number } | null> {
  const token = await getToken();

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().slice(0, 19).replace("T", " "),
      pickup_location: PICKUP_LOCATION,
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: "",
      billing_address: order.shippingAddress.line1,
      billing_address_2: order.shippingAddress.line2 ?? "",
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.buyerEmail,
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map((item) => ({
        name: item.productName,
        sku: item.productId ?? item.productName,
        units: item.quantity,
        selling_price: toRupees(item.unitPrice),
      })),
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: toRupees(order.subtotal),
      length: DEFAULT_PACKAGE.length,
      breadth: DEFAULT_PACKAGE.breadth,
      height: DEFAULT_PACKAGE.height,
      weight: DEFAULT_PACKAGE.weight,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket order creation failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  if (!data.shipment_id || !data.order_id) return null;
  return { shipmentId: data.shipment_id, shiprocketOrderId: data.order_id };
}
