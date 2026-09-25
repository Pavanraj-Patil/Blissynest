import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getBusinessDetails } from "@/lib/content-service";
import {
  orderConfirmationEmail,
  orderStatusEmail,
  teamNotificationEmail,
  type OrderEmailData,
} from "@/lib/email-templates";

type StoredAddress = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
};

function formatAddress(raw: unknown): string {
  const a = (raw ?? {}) as StoredAddress;
  return [a.name, a.line1, a.line2, [a.city, a.state].filter(Boolean).join(", "), a.pincode, a.phone && `Phone: ${a.phone}`]
    .filter(Boolean)
    .join(", ");
}

async function loadOrderForEmail(orderId: string): Promise<(OrderEmailData & { buyerEmail: string }) | null> {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return null;
  return {
    orderNumber: order.orderNumber,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    items: order.items.map((i) => ({ name: i.productName, quantity: i.quantity, unitPrice: i.unitPrice })),
    subtotal: order.subtotal,
    discount: order.discount,
    shippingCost: order.shippingCost,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    address: formatAddress(order.shippingAddress),
    trackingNumber: order.trackingNumber,
    carrierName: order.carrierName,
  };
}

// Where internal notifications (new contact messages, corporate leads, new
// orders) go: TEAM_NOTIFY_EMAIL if set, else the support address from Site
// Content → Legal & Business.
export async function getTeamEmail(): Promise<string | null> {
  if (process.env.TEAM_NOTIFY_EMAIL) return process.env.TEAM_NOTIFY_EMAIL;
  const business = await getBusinessDetails();
  return business.contactEmail || null;
}

// All of these are fire-and-forget from the caller's point of view: they
// swallow their own errors so a mail problem can never fail an order.
export async function emailOrderConfirmation(orderId: string): Promise<void> {
  try {
    const order = await loadOrderForEmail(orderId);
    if (!order) return;
    await sendEmail({ to: order.buyerEmail, ...orderConfirmationEmail(order) });

    const team = await getTeamEmail();
    if (team) {
      await sendEmail({
        to: team,
        ...teamNotificationEmail({
          title: `New order ${order.orderNumber}`,
          fields: [
            ["Customer", `${order.buyerName} <${order.buyerEmail}>`],
            ["Items", order.items.map((i) => `${i.name} × ${i.quantity}`).join("\n")],
            ["Total", `₹${(order.total / 100).toLocaleString("en-IN")}`],
            ["Payment", `${order.paymentMethod} (${order.paymentStatus})`],
            ["Deliver to", order.address],
          ],
        }),
      });
    }
  } catch (err) {
    console.error("[email] order confirmation failed", err);
  }
}

export async function emailOrderStatus(orderId: string, status: "SHIPPED" | "DELIVERED" | "CANCELLED"): Promise<void> {
  try {
    const order = await loadOrderForEmail(orderId);
    if (!order) return;
    // Signed-in customers can switch "Order updates" off in Account → Settings.
    const record = await db.order.findUnique({ where: { id: orderId }, select: { user: { select: { notifyOrders: true } } } });
    if (record?.user && record.user.notifyOrders === false) return;
    await sendEmail({ to: order.buyerEmail, ...orderStatusEmail(order, status) });
  } catch (err) {
    console.error("[email] order status email failed", err);
  }
}

export async function emailTeam(title: string, fields: [string, string][], replyTo?: string): Promise<void> {
  try {
    const team = await getTeamEmail();
    if (!team) return;
    await sendEmail({ to: team, replyTo, ...teamNotificationEmail({ title, fields }) });
  } catch (err) {
    console.error("[email] team notification failed", err);
  }
}
