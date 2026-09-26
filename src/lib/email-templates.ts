import { getSiteUrl } from "@/lib/site-url";

// The look of every email the site sends. HTML is built from inline styles and
// simple blocks so it renders the same in Gmail, Outlook and phone apps; every
// email also returns a plain text version. The wording comes from Admin > Site
// Content > Emails (see EmailContext), with {name} and {orderNumber} filled in.

const COLORS = {
  cream: "#f8f3ec",
  creamDark: "#f0e8da",
  olive: "#4a5738",
  oliveDark: "#3a4529",
  terracotta: "#c1693d",
  gold: "#b08d57",
  goldLight: "#cfb587",
  charcoal: "#2a2621",
  body: "#524b41",
  muted: "#7a7267",
  line: "#e6dccb",
};

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Helvetica,Arial,sans-serif";

// What a template needs beyond the order itself: the editable wording, and the
// business details shown in the footer.
export type EmailCopy = Record<string, Record<string, string>>;
export type EmailBusiness = { contactEmail: string; contactPhone: string; address: string };
export type EmailContext = { copy: EmailCopy; business: EmailBusiness };

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

// Replace {name} style placeholders; unknown ones are left as they are.
function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (whole, key: string) => (key in vars ? vars[key] : whole));
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:26px auto 6px;"><tr><td style="background:${COLORS.olive};border-radius:999px;"><a href="${escapeHtml(href)}" style="display:inline-block;font-family:${SANS};color:#f8f3ec;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;padding:16px 34px;">${escapeHtml(label)}</a></td></tr></table>`;
}

const p = (html: string) =>
  `<p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${COLORS.body};margin:0 0 16px;">${html}</p>`;

const small = (html: string) =>
  `<p style="font-family:${SANS};font-size:12.5px;line-height:1.7;color:${COLORS.muted};margin:0 0 14px;">${html}</p>`;

function label(text: string): string {
  return `<div style="font-family:${SANS};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.gold};font-weight:700;margin:0 0 8px;">${escapeHtml(text)}</div>`;
}

function chip(title: string, value: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin:0 0 22px;"><tr><td style="background:${COLORS.cream};border:1px solid ${COLORS.line};border-radius:14px;padding:14px 18px;font-family:${SANS};">
    <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${COLORS.muted};">${escapeHtml(title)}</div>
    <div style="font-family:${SERIF};font-size:20px;color:${COLORS.charcoal};margin-top:2px;letter-spacing:0.04em;">${escapeHtml(value)}</div>
  </td></tr></table>`;
}

function footerLinks(site: string): string {
  const links: [string, string][] = [
    ["Shop", `${site}/shop`],
    ["Track order", `${site}/track-order`],
    ["FAQs", `${site}/faqs`],
    ["Contact", `${site}/contact`],
  ];
  return links
    .map(([text, href]) => `<a href="${href}" style="color:${COLORS.body};text-decoration:none;font-family:${SANS};font-size:12px;letter-spacing:0.06em;">${text}</a>`)
    .join(`<span style="color:${COLORS.goldLight};padding:0 10px;">&bull;</span>`);
}

type WrapParams = {
  eyebrow?: string;
  heading: string;
  preheader?: string;
  bodyHtml: string;
  ctx: EmailContext;
  // Customer emails end with a sign off and a help box; internal ones don't.
  customer?: boolean;
};

export function wrapEmail(params: WrapParams): string {
  const site = getSiteUrl();
  const { copy, business } = params.ctx;
  const general = copy.general ?? {};

  const contactBits = [
    business.contactEmail && `<a href="mailto:${escapeHtml(business.contactEmail)}" style="color:${COLORS.olive};text-decoration:none;font-weight:700;">${escapeHtml(business.contactEmail)}</a>`,
    business.contactPhone && escapeHtml(business.contactPhone),
  ].filter(Boolean);

  const customerFooter = params.customer
    ? `<p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${COLORS.body};margin:26px 0 0;">${escapeHtml(general.signOff ?? "")}<br><span style="font-family:${SERIF};font-size:17px;color:${COLORS.charcoal};">${escapeHtml(general.signOffName ?? "")}</span></p>
      <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin:26px 0 0;"><tr><td style="background:${COLORS.cream};border-radius:14px;padding:16px 18px;font-family:${SANS};font-size:13px;line-height:1.7;color:${COLORS.body};">
        <strong style="color:${COLORS.charcoal};">${escapeHtml(general.helpTitle ?? "")}</strong><br>${escapeHtml(general.helpText ?? "")}${contactBits.length ? `<br>${contactBits.join(`<span style="color:${COLORS.goldLight};padding:0 8px;">&bull;</span>`)}` : ""}
      </td></tr></table>`
    : "";

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(params.heading)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.creamDark};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(params.preheader ?? "")}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.creamDark};"><tr><td align="center" style="padding:28px 14px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
    <tr><td align="center" style="padding:6px 0 22px;">
      <a href="${site}" style="text-decoration:none;"><img src="${site}/email/logo.png" alt="Blissynest" width="200" style="display:block;border:0;width:200px;max-width:70%;height:auto;"></a>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid ${COLORS.line};border-radius:22px;overflow:hidden;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="background:${COLORS.olive};padding:34px 30px 32px;border-radius:22px 22px 0 0;" align="center">
        ${params.eyebrow ? `<div style="font-family:${SANS};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.goldLight};font-weight:700;margin:0 0 12px;">${escapeHtml(params.eyebrow)}</div>` : ""}
        <h1 style="font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:normal;color:#f8f3ec;margin:0;">${escapeHtml(params.heading)}</h1>
      </td></tr></table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:30px 30px 32px;">
        ${params.bodyHtml}
        ${customerFooter}
      </td></tr></table>
    </td></tr>
    <tr><td align="center" style="padding:24px 10px 0;">
      <div>${footerLinks(site)}</div>
      ${business.address ? `<p style="font-family:${SANS};font-size:12px;line-height:1.6;color:${COLORS.muted};margin:14px 0 0;">${escapeHtml(business.address)}</p>` : ""}
      ${params.customer && general.footerNote ? `<p style="font-family:${SANS};font-size:11.5px;line-height:1.6;color:${COLORS.muted};margin:10px 0 0;">${escapeHtml(general.footerNote)}</p>` : ""}
      <p style="font-family:${SANS};font-size:11.5px;color:${COLORS.muted};margin:10px 0 0;">&copy; ${new Date().getFullYear()} Blissynest &middot; <a href="${site}" style="color:${COLORS.muted};">${site.replace(/^https?:\/\//, "")}</a></p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function textFooter(ctx: EmailContext, customer: boolean): string {
  const g = ctx.copy.general ?? {};
  const contact = [ctx.business.contactEmail, ctx.business.contactPhone].filter(Boolean).join(" | ");
  if (!customer) return "";
  return `\n\n${g.signOff ?? ""}\n${g.signOffName ?? ""}\n\n${g.helpTitle ?? ""} ${g.helpText ?? ""}${contact ? `\n${contact}` : ""}`;
}

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
  giftNote?: string | null;
  trackingNumber?: string | null;
  carrierName?: string | null;
};

function itemsTable(order: OrderEmailData): string {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:12px 0;font-family:${SANS};font-size:14px;color:${COLORS.charcoal};border-bottom:1px solid ${COLORS.line};">${escapeHtml(i.name)}<div style="font-size:12px;color:${COLORS.muted};margin-top:2px;">Quantity ${i.quantity}</div></td><td style="padding:12px 0;font-family:${SANS};font-size:14px;color:${COLORS.charcoal};text-align:right;vertical-align:top;border-bottom:1px solid ${COLORS.line};white-space:nowrap;">${formatRupees(i.unitPrice * i.quantity)}</td></tr>`
    )
    .join("");
  const line = (name: string, value: string, bold = false) =>
    `<tr><td style="padding:${bold ? "12px" : "5px"} 0 ${bold ? "0" : "5px"};font-family:${SANS};font-size:${bold ? "16px" : "14px"};${bold ? `font-weight:700;color:${COLORS.charcoal};border-top:2px solid ${COLORS.charcoal};` : `color:${COLORS.muted};`}">${name}</td><td style="padding:${bold ? "12px" : "5px"} 0 ${bold ? "0" : "5px"};font-family:${SANS};font-size:${bold ? "16px" : "14px"};text-align:right;${bold ? `font-weight:700;color:${COLORS.charcoal};border-top:2px solid ${COLORS.charcoal};` : `color:${COLORS.body};`}">${value}</td></tr>`;
  return `${label("Your gifts")}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">${rows}
    <tr><td colspan="2" style="height:8px;"></td></tr>
    ${line("Subtotal", formatRupees(order.subtotal))}
    ${order.discount > 0 ? line("Discount", `− ${formatRupees(order.discount)}`) : ""}
    ${line("Shipping", order.shippingCost === 0 ? "Free" : formatRupees(order.shippingCost))}
    <tr><td colspan="2" style="height:6px;"></td></tr>
    ${line("Total", formatRupees(order.total), true)}
  </table>`;
}

function itemsText(order: OrderEmailData): string {
  return order.items.map((i) => `- ${i.name} x ${i.quantity}  ${formatRupees(i.unitPrice * i.quantity)}`).join("\n");
}

function vars(order: { orderNumber: string; buyerName: string }): Record<string, string> {
  return { name: order.buyerName.split(" ")[0] || order.buyerName, orderNumber: order.orderNumber };
}

export function orderConfirmationEmail(order: OrderEmailData, ctx: EmailContext) {
  const site = getSiteUrl();
  const c = ctx.copy["order-confirmation"] ?? {};
  const v = vars(order);
  const payLine =
    order.paymentMethod === "COD" ? c.codNote : order.paymentStatus === "PAID" ? c.paidNote : c.pendingNote;

  const steps = [c.step1, c.step2, c.step3].filter(Boolean);
  const stepsHtml = steps.length
    ? `${label(c.stepsTitle ?? "")}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">${steps
        .map(
          (s, i) =>
            `<tr><td width="34" valign="top" style="padding:6px 0;"><div style="width:24px;height:24px;line-height:24px;text-align:center;border-radius:12px;background:${COLORS.creamDark};color:${COLORS.olive};font-family:${SANS};font-size:12px;font-weight:700;">${i + 1}</div></td><td style="padding:6px 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${COLORS.body};">${escapeHtml(fill(s, v))}</td></tr>`
        )
        .join("")}</table>`
    : "";

  const giftHtml = order.giftNote
    ? `${label("Your gift note")}<div style="font-family:${SERIF};font-style:italic;font-size:16px;line-height:1.6;color:${COLORS.oliveDark};background:${COLORS.cream};border-radius:14px;padding:16px 18px;margin:0 0 24px;">&ldquo;${escapeHtml(order.giftNote).replace(/\n/g, "<br>")}&rdquo;</div>`
    : "";

  const html = wrapEmail({
    ctx,
    customer: true,
    eyebrow: fill(c.eyebrow ?? "", v),
    heading: fill(c.heading ?? "", v),
    preheader: `Order ${order.orderNumber} is confirmed.`,
    bodyHtml:
      p(escapeHtml(fill(c.intro ?? "", v))) +
      chip("Order number", order.orderNumber) +
      itemsTable(order) +
      `${label("Delivering to")}${p(escapeHtml(order.address))}` +
      p(`<span style="color:${COLORS.charcoal};font-weight:700;">${escapeHtml(payLine ?? "")}</span>`) +
      giftHtml +
      stepsHtml +
      button(c.button ?? "Track your order", `${site}/track-order`) +
      small(`<span style="display:block;text-align:center;">Track it any time with your order number and this email address.</span>`),
  });

  const text = `${fill(c.heading ?? "", v)}\n\n${fill(c.intro ?? "", v)}\n\nOrder number: ${order.orderNumber}\n\n${itemsText(order)}\n\nSubtotal ${formatRupees(order.subtotal)}${order.discount > 0 ? `\nDiscount -${formatRupees(order.discount)}` : ""}\nShipping ${order.shippingCost === 0 ? "Free" : formatRupees(order.shippingCost)}\nTotal ${formatRupees(order.total)}\n\nDelivering to: ${order.address}\n${payLine ?? ""}${order.giftNote ? `\n\nYour gift note: ${order.giftNote}` : ""}${steps.length ? `\n\n${c.stepsTitle ?? ""}\n${steps.map((s, i) => `${i + 1}. ${fill(s, v)}`).join("\n")}` : ""}\n\n${c.button ?? "Track your order"}: ${site}/track-order${textFooter(ctx, true)}`;
  return { subject: fill(c.subject ?? "", v), html, text };
}

export function orderStatusEmail(order: OrderEmailData, status: "SHIPPED" | "DELIVERED" | "CANCELLED", ctx: EmailContext) {
  const site = getSiteUrl();
  const key = { SHIPPED: "order-shipped", DELIVERED: "order-delivered", CANCELLED: "order-cancelled" }[status];
  const c = ctx.copy[key] ?? {};
  const v = vars(order);
  const trackingLine =
    status === "SHIPPED" && (order.trackingNumber || order.carrierName)
      ? [order.carrierName, order.trackingNumber].filter(Boolean).join(", ")
      : "";

  const html = wrapEmail({
    ctx,
    customer: true,
    eyebrow: fill(c.eyebrow ?? "", v),
    heading: fill(c.heading ?? "", v),
    preheader: fill(c.intro ?? "", v),
    bodyHtml:
      p(`Hi ${escapeHtml(v.name)},`) +
      p(escapeHtml(fill(c.intro ?? "", v))) +
      chip("Order number", order.orderNumber) +
      (trackingLine ? chip("Tracking", trackingLine) : "") +
      button(c.button ?? "View order status", `${site}/track-order`),
  });

  const text = `${fill(c.heading ?? "", v)}\n\nHi ${v.name},\n${fill(c.intro ?? "", v)}\n\nOrder number: ${order.orderNumber}${trackingLine ? `\nTracking: ${trackingLine}` : ""}\n\n${c.button ?? "View order status"}: ${site}/track-order${textFooter(ctx, true)}`;
  return { subject: fill(c.subject ?? "", v), html, text };
}

export function passwordResetEmail(name: string | null, resetUrl: string, ctx: EmailContext) {
  const c = ctx.copy["password-reset"] ?? {};
  const v = { name: name?.split(" ")[0] || "there", orderNumber: "" };
  const html = wrapEmail({
    ctx,
    customer: true,
    eyebrow: c.eyebrow,
    heading: fill(c.heading ?? "", v),
    preheader: "Use this link to choose a new password.",
    bodyHtml:
      p(`Hi ${escapeHtml(v.name)},`) +
      p(escapeHtml(fill(c.intro ?? "", v))) +
      button(c.button ?? "Choose a new password", resetUrl) +
      small(`<span style="display:block;text-align:center;">If the button doesn&rsquo;t work, copy this address into your browser:<br><span style="word-break:break-all;color:${COLORS.body};">${escapeHtml(resetUrl)}</span></span>`) +
      p(escapeHtml(c.ignoreNote ?? "")),
  });
  const text = `${fill(c.heading ?? "", v)}\n\nHi ${v.name},\n\n${fill(c.intro ?? "", v)}\n${resetUrl}\n\n${c.ignoreNote ?? ""}${textFooter(ctx, true)}`;
  return { subject: fill(c.subject ?? "", v), html, text };
}

export function passwordChangedEmail(name: string | null, ctx: EmailContext) {
  const site = getSiteUrl();
  const c = ctx.copy["password-changed"] ?? {};
  const v = { name: name?.split(" ")[0] || "there", orderNumber: "" };
  const html = wrapEmail({
    ctx,
    customer: true,
    eyebrow: c.eyebrow,
    heading: fill(c.heading ?? "", v),
    preheader: "Your Blissynest password was just changed.",
    bodyHtml:
      p(`Hi ${escapeHtml(v.name)},`) +
      p(escapeHtml(fill(c.intro ?? "", v))) +
      p(escapeHtml(c.warnNote ?? "")) +
      button(c.button ?? "Reset my password", `${site}/forgot-password`),
  });
  const text = `${fill(c.heading ?? "", v)}\n\nHi ${v.name},\n${fill(c.intro ?? "", v)}\n${c.warnNote ?? ""}\n\n${c.button ?? "Reset my password"}: ${site}/forgot-password${textFooter(ctx, true)}`;
  return { subject: fill(c.subject ?? "", v), html, text };
}

// Internal notification to the team when a form is submitted.
export function teamNotificationEmail(params: { title: string; fields: [string, string][]; replyTo?: string }, ctx: EmailContext) {
  const rows = params.fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 14px 9px 0;font-family:${SANS};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};vertical-align:top;white-space:nowrap;border-bottom:1px solid ${COLORS.line};">${escapeHtml(k)}</td><td style="padding:9px 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${COLORS.charcoal};border-bottom:1px solid ${COLORS.line};">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  const html = wrapEmail({
    ctx,
    eyebrow: "For the team",
    heading: params.title,
    bodyHtml: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>`,
  });
  const text = `${params.title}\n\n${params.fields.map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  return { subject: params.title, html, text };
}
