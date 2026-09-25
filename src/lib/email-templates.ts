import { getSiteUrl } from "@/lib/site-url";

// Plain, table-free HTML with inline styles — works in every mail client.
// Every template returns both html and a text fallback.

const COLORS = { cream: "#f8f3ec", olive: "#4a5738", charcoal: "#2a2621", muted: "#7a7267", line: "#e6dccb" };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function button(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORS.olive};color:#f8f3ec;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;border-radius:12px;">${escapeHtml(label)}</a>`;
}

export function wrapEmail(params: { heading: string; bodyHtml: string; preheader?: string }): string {
  const site = getSiteUrl();
  return `<!doctype html><html><body style="margin:0;padding:0;background:${COLORS.cream};font-family:Helvetica,Arial,sans-serif;color:${COLORS.charcoal};">
<span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(params.preheader ?? "")}</span>
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">
  <div style="text-align:center;padding-bottom:20px;"><a href="${site}" style="font-family:Georgia,serif;font-size:26px;color:${COLORS.charcoal};text-decoration:none;letter-spacing:0.14em;">BLISSYNEST</a></div>
  <div style="background:#ffffff;border:1px solid ${COLORS.line};border-radius:16px;padding:28px 24px;">
    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:normal;margin:0 0 14px;">${escapeHtml(params.heading)}</h1>
    ${params.bodyHtml}
  </div>
  <p style="text-align:center;font-size:12px;color:${COLORS.muted};margin:18px 0 0;">Blissynest · <a href="${site}" style="color:${COLORS.muted};">${site.replace(/^https?:\/\//, "")}</a></p>
</div></body></html>`;
}

const p = (html: string) => `<p style="font-size:14px;line-height:1.6;margin:0 0 14px;">${html}</p>`;

export type OrderEmailData = {
  orderNumber: string;
  buyerName: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  address: string;
  trackingNumber?: string | null;
  carrierName?: string | null;
};

function itemsTable(order: OrderEmailData): string {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;font-size:14px;border-bottom:1px solid ${COLORS.line};">${escapeHtml(i.name)} <span style="color:${COLORS.muted};">× ${i.quantity}</span></td><td style="padding:8px 0;font-size:14px;text-align:right;border-bottom:1px solid ${COLORS.line};">${formatRupees(i.unitPrice * i.quantity)}</td></tr>`
    )
    .join("");
  const line = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:4px 0;font-size:14px;${bold ? "font-weight:700;" : `color:${COLORS.muted};`}">${label}</td><td style="padding:4px 0;font-size:14px;text-align:right;${bold ? "font-weight:700;" : ""}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:6px 0 16px;">${rows}
    ${line("Subtotal", formatRupees(order.subtotal))}
    ${order.discount > 0 ? line("Discount", `− ${formatRupees(order.discount)}`) : ""}
    ${line("Shipping", order.shippingCost === 0 ? "Free" : formatRupees(order.shippingCost))}
    ${line("Total", formatRupees(order.total), true)}
  </table>`;
}

function itemsText(order: OrderEmailData): string {
  return order.items.map((i) => `- ${i.name} × ${i.quantity}  ${formatRupees(i.unitPrice * i.quantity)}`).join("\n");
}

export function orderConfirmationEmail(order: OrderEmailData) {
  const site = getSiteUrl();
  const payLine =
    order.paymentMethod === "COD"
      ? "Payment: Cash on Delivery — please keep the amount ready."
      : order.paymentStatus === "PAID"
        ? "Payment: received — thank you."
        : "Payment: pending.";
  const html = wrapEmail({
    heading: "Thank you — your order is placed",
    preheader: `Order ${order.orderNumber} is confirmed.`,
    bodyHtml:
      p(`Hi ${escapeHtml(order.buyerName)}, we&rsquo;re already getting your gifts ready.`) +
      p(`<strong>Order number:</strong> ${escapeHtml(order.orderNumber)}`) +
      itemsTable(order) +
      p(`<strong>Delivering to:</strong><br>${escapeHtml(order.address)}`) +
      p(escapeHtml(payLine)) +
      `<div style="margin:20px 0 4px;text-align:center;">${button("Track your order", `${site}/track-order`)}</div>` +
      p(`<span style="color:${COLORS.muted};font-size:12px;">You can track it any time with your order number and this email address.</span>`),
  });
  const text = `Thank you — your order is placed\n\nHi ${order.buyerName}, order ${order.orderNumber} is confirmed.\n\n${itemsText(order)}\n\nSubtotal ${formatRupees(order.subtotal)}${order.discount > 0 ? `\nDiscount -${formatRupees(order.discount)}` : ""}\nShipping ${order.shippingCost === 0 ? "Free" : formatRupees(order.shippingCost)}\nTotal ${formatRupees(order.total)}\n\nDelivering to: ${order.address}\n${payLine}\n\nTrack your order: ${site}/track-order`;
  return { subject: `Your Blissynest order ${order.orderNumber} is confirmed`, html, text };
}

export function orderStatusEmail(order: OrderEmailData, status: "SHIPPED" | "DELIVERED" | "CANCELLED") {
  const site = getSiteUrl();
  const copy = {
    SHIPPED: {
      subject: `Your Blissynest order ${order.orderNumber} has shipped`,
      heading: "Your order is on its way",
      line: "Good news — your order has been handed to the courier.",
    },
    DELIVERED: {
      subject: `Your Blissynest order ${order.orderNumber} was delivered`,
      heading: "Your order has been delivered",
      line: "We hope it makes someone smile. If anything isn't right, just reply to this email and we'll sort it out.",
    },
    CANCELLED: {
      subject: `Your Blissynest order ${order.orderNumber} was cancelled`,
      heading: "Your order was cancelled",
      line: "Your order has been cancelled. If you paid online, the refund goes back to your original payment method within 5–7 business days. Questions? Just reply to this email.",
    },
  }[status];
  const tracking =
    status === "SHIPPED" && (order.trackingNumber || order.carrierName)
      ? p(`<strong>Tracking:</strong> ${escapeHtml([order.carrierName, order.trackingNumber].filter(Boolean).join(" — "))}`)
      : "";
  const html = wrapEmail({
    heading: copy.heading,
    preheader: copy.line,
    bodyHtml:
      p(`Hi ${escapeHtml(order.buyerName)},`) +
      p(escapeHtml(copy.line)) +
      p(`<strong>Order number:</strong> ${escapeHtml(order.orderNumber)}`) +
      tracking +
      `<div style="margin:20px 0 4px;text-align:center;">${button("View order status", `${site}/track-order`)}</div>`,
  });
  const text = `${copy.heading}\n\nHi ${order.buyerName},\n${copy.line}\nOrder number: ${order.orderNumber}${
    status === "SHIPPED" && (order.trackingNumber || order.carrierName)
      ? `\nTracking: ${[order.carrierName, order.trackingNumber].filter(Boolean).join(" — ")}`
      : ""
  }\n\nOrder status: ${site}/track-order`;
  return { subject: copy.subject, html, text };
}

export function passwordResetEmail(name: string | null, resetUrl: string) {
  const html = wrapEmail({
    heading: "Reset your password",
    preheader: "Use this link to choose a new password.",
    bodyHtml:
      p(`Hi ${escapeHtml(name || "there")},`) +
      p("We received a request to reset the password for your Blissynest account. This link works for 1 hour.") +
      `<div style="margin:20px 0;text-align:center;">${button("Choose a new password", resetUrl)}</div>` +
      p(`<span style="color:${COLORS.muted};font-size:12px;">If the button doesn&rsquo;t work, copy this address into your browser:<br>${escapeHtml(resetUrl)}</span>`) +
      p("If you didn&rsquo;t ask for this, you can safely ignore this email — your password won&rsquo;t change."),
  });
  const text = `Reset your password\n\nHi ${name || "there"},\n\nWe received a request to reset your Blissynest password. Use this link within 1 hour:\n${resetUrl}\n\nIf you didn't ask for this, ignore this email — your password won't change.`;
  return { subject: "Reset your Blissynest password", html, text };
}

export function passwordChangedEmail(name: string | null) {
  const site = getSiteUrl();
  const html = wrapEmail({
    heading: "Your password was changed",
    preheader: "Your Blissynest password was just changed.",
    bodyHtml:
      p(`Hi ${escapeHtml(name || "there")},`) +
      p("The password on your Blissynest account was just changed.") +
      p(`If this was you, there&rsquo;s nothing more to do. If it wasn&rsquo;t, please <a href="${site}/forgot-password">reset your password</a> straight away and contact us.`),
  });
  const text = `Your password was changed\n\nHi ${name || "there"},\nThe password on your Blissynest account was just changed. If this wasn't you, reset it at ${site}/forgot-password and contact us.`;
  return { subject: "Your Blissynest password was changed", html, text };
}

// Internal notification to the team when a form is submitted.
export function teamNotificationEmail(params: { title: string; fields: [string, string][]; replyTo?: string }) {
  const rows = params.fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-size:13px;color:${COLORS.muted};vertical-align:top;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  const html = wrapEmail({
    heading: params.title,
    bodyHtml: `<table role="presentation" cellspacing="0" cellpadding="0">${rows}</table>`,
  });
  const text = `${params.title}\n\n${params.fields.map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  return { subject: params.title, html, text };
}
