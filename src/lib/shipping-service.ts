import { db } from "@/lib/db";
import { isShiprocketConfigured, createShiprocketOrder } from "@/lib/shiprocket";

// Called after an order is persisted (COD or a verified Razorpay payment)
// — best-effort. Shipping isn't set up until there's a real Shiprocket
// account with a configured pickup location, so this silently no-ops until
// then rather than blocking or failing order placement, and any runtime
// error here is caught and logged, never surfaced to the customer: the
// order itself already succeeded and paid (if applicable) by this point.
export async function createShipmentForOrder(orderId: string): Promise<void> {
  if (!isShiprocketConfigured()) return;

  try {
    const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) return;

    const address = order.shippingAddress as {
      name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
    };

    const result = await createShiprocketOrder({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      total: order.total,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerPhone: order.buyerPhone,
      shippingAddress: address,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productId: item.productId,
      })),
    });

    if (result) {
      await db.order.update({
        where: { id: orderId },
        data: { trackingNumber: String(result.shipmentId), carrierName: "Shiprocket" },
      });
    }
  } catch (err) {
    console.error(`Shiprocket shipment creation failed for order ${orderId}:`, err);
  }
}
