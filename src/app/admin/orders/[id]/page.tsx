import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User, Gift, CreditCard } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getOrderForAdmin } from "@/lib/admin/order-service";
import type { CartItemCustomization } from "@/lib/product-adapters";
import { OrderStatusEditor } from "./OrderStatusEditor";

// What the shopper asked for on a personalised line — the seller needs all of
// it (text, font/colour, options, and any photos they sent) to produce the
// item. Photos link to the full-size original, since these are print sources.
function ItemCustomization({ customization }: { customization: CartItemCustomization | null }) {
  if (!customization) return null;
  const lines = (customization.textLines ?? []).filter(Boolean);
  const options = [
    customization.variant,
    ...Object.entries(customization.variants ?? {}).map(([label, value]) => `${label}: ${value}`),
  ].filter(Boolean);
  const photos = customization.imageUrls ?? [];
  if (lines.length === 0 && options.length === 0 && photos.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5 rounded-lg bg-cream/60 px-3 py-2 text-xs text-charcoal-light">
      {lines.length > 0 && (
        <p>
          <span className="font-medium text-charcoal">Text:</span> &ldquo;{lines.join(" / ")}&rdquo;
          {customization.font && ` · ${customization.font}`}
          {customization.colorHex && (
            <span className="ml-1.5 inline-flex items-center gap-1 align-middle">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full border border-charcoal/15"
                style={{ backgroundColor: customization.colorHex }}
              />
              {customization.colorHex}
            </span>
          )}
        </p>
      )}
      {options.length > 0 && (
        <p>
          <span className="font-medium text-charcoal">Options:</span> {options.join(" · ")}
        </p>
      )}
      {photos.length > 0 && (
        <div>
          <p className="font-medium text-charcoal">
            Customer photo{photos.length === 1 ? "" : "s"} ({photos.length}) — click to open full size
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {photos.map((src, i) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                {/* Plain <img>: customer upload on the R2 host, admin-only preview. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Customer photo ${i + 1}`}
                  className="h-16 w-16 rounded-lg border border-charcoal/10 object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("orders");
  const { id } = await params;
  const order = await getOrderForAdmin(id);
  if (!order) notFound();

  const address = order.shippingAddress as {
    label: string;
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-charcoal">
        <ArrowLeft size={14} />
        All Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Placed {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`/admin/orders/${order.id}/slip`}
            target="_blank"
            rel="noopener"
            className="rounded-lg border border-charcoal/15 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-cream-dark"
          >
            Print packing slip
          </a>
          {order.userId ? (
            <Link href={`/admin/customers/${order.userId}`} className="text-xs text-ink-muted hover:text-terracotta-dark">
              View customer →
            </Link>
          ) : (
            <span className="text-xs text-ink-muted">Guest checkout — no account</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="font-serif text-lg text-charcoal mb-4">Items ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.product ? (
                      <Link
                        href={`/product/${item.product.slug}`}
                        target="_blank"
                        className="text-sm font-medium text-charcoal hover:text-terracotta-dark"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-charcoal">{item.productName}</p>
                    )}
                    <p className="text-xs text-ink-muted">
                      Qty {item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")}
                    </p>
                    <ItemCustomization customization={item.customization as CartItemCustomization | null} />
                  </div>
                  <p className="text-sm font-medium text-charcoal shrink-0">
                    ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-1.5 border-t border-charcoal/10 pt-4 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-olive-dark">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-light">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost.toLocaleString("en-IN")}`}</span>
              </div>
              {order.gstAmount > 0 && (
                <div className="flex justify-between text-charcoal-light">
                  <span>GST</span>
                  <span>₹{order.gstAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-charcoal pt-1.5 border-t border-charcoal/10">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {order.isGift && (
            <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
              <h2 className="flex items-center gap-2 font-serif text-lg text-charcoal mb-2">
                <Gift size={16} className="text-terracotta" />
                Gift
              </h2>
              <p className="text-sm text-charcoal-light">{order.giftNote || "No message added"}</p>
              {order.hidePricesOnSlip && (
                <p className="mt-1.5 text-xs text-olive-dark">Prices hidden on packing slip</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg text-charcoal mb-3">
              <User size={16} className="text-terracotta" />
              Customer
            </h2>
            <p className="text-sm text-charcoal">{order.buyerName}</p>
            <p className="text-sm text-ink-muted">{order.buyerEmail}</p>
            <p className="text-sm text-ink-muted">{order.buyerPhone}</p>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg text-charcoal mb-3">
              <MapPin size={16} className="text-terracotta" />
              Shipping Address
            </h2>
            <p className="text-sm text-charcoal">{address.name}</p>
            <p className="text-sm text-ink-muted leading-relaxed">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-sm text-ink-muted">{address.phone}</p>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg text-charcoal mb-3">
              <CreditCard size={16} className="text-terracotta" />
              Payment
            </h2>
            <p className="text-sm text-charcoal">{order.paymentMethod}</p>
            {order.razorpayPaymentId && (
              <p className="mt-1 text-xs text-ink-muted break-all">Payment ID: {order.razorpayPaymentId}</p>
            )}
            {order.razorpayOrderId && (
              <p className="text-xs text-ink-muted break-all">Razorpay Order: {order.razorpayOrderId}</p>
            )}
          </div>

          <OrderStatusEditor
            orderId={order.id}
            initialStatus={order.status}
            initialPaymentStatus={order.paymentStatus}
            initialTrackingNumber={order.trackingNumber ?? ""}
            initialCarrierName={order.carrierName ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
