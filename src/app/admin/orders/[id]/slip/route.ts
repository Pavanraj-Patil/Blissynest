import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { getOrderForAdmin } from "@/lib/admin/order-service";
import { escapeHtml } from "@/lib/email-templates";
import type { CartItemCustomization } from "@/lib/product-adapters";

// GET /admin/orders/[id]/slip — a standalone, print-ready packing slip (no
// admin sidebar). Honors the shopper's "hide prices on the slip" gift option
// and prints their gift note, so the parcel can be packed straight from it.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdminApi("orders");
  if ("error" in check) {
    return new NextResponse(check.error, { status: check.status });
  }

  const { id } = await params;
  const order = await getOrderForAdmin(id);
  if (!order) return new NextResponse("Order not found", { status: 404 });

  const a = (order.shippingAddress ?? {}) as Record<string, string | undefined>;
  const addressLines = [
    a.name,
    a.line1,
    a.line2,
    [a.city, a.state].filter(Boolean).join(", "),
    a.pincode,
    a.phone && `Phone: ${a.phone}`,
  ].filter(Boolean) as string[];

  const showPrices = !order.hidePricesOnSlip;
  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const rows = order.items
    .map((item) => {
      const c = (item.customization ?? null) as CartItemCustomization | null;
      const details: string[] = [];
      if (c?.textLines?.filter(Boolean).length) {
        details.push(`Text: “${c.textLines.filter(Boolean).join(" / ")}”${c.font ? ` · ${c.font}` : ""}${c.colorHex ? ` · ${c.colorHex}` : ""}`);
      }
      if (c?.variant) details.push(String(c.variant));
      for (const [label, value] of Object.entries(c?.variants ?? {})) details.push(`${label}: ${value}`);
      if (c?.imageUrls?.length) details.push(`${c.imageUrls.length} customer photo(s) — see order in admin`);
      return `<tr>
        <td class="qty">${item.quantity} ×</td>
        <td>${escapeHtml(item.productName)}${details.length ? `<div class="detail">${details.map(escapeHtml).join("<br>")}</div>` : ""}</td>
        ${showPrices ? `<td class="num">${money(item.unitPrice * item.quantity)}</td>` : ""}
      </tr>`;
    })
    .join("");

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Packing slip ${escapeHtml(order.orderNumber)}</title>
<style>
  body { font-family: Helvetica, Arial, sans-serif; color: #2a2621; margin: 0; padding: 32px; max-width: 720px; }
  h1 { font-family: Georgia, serif; font-weight: normal; letter-spacing: 0.14em; margin: 0; font-size: 26px; }
  .muted { color: #6f675c; font-size: 13px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2a2621; padding-bottom: 14px; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #6f675c; margin: 24px 0 6px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 9px 0; border-bottom: 1px solid #ddd3c2; vertical-align: top; font-size: 14px; }
  td.qty { width: 44px; font-weight: 700; }
  td.num { text-align: right; white-space: nowrap; }
  .detail { font-size: 12px; color: #6f675c; margin-top: 3px; }
  .gift { border: 1px dashed #2a2621; border-radius: 8px; padding: 12px 14px; font-size: 14px; }
  .totals td { border: 0; padding: 3px 0; }
  .btn { position: fixed; top: 14px; right: 14px; background: #4a5738; color: #fff; border: 0; border-radius: 8px; padding: 10px 18px; font-size: 13px; cursor: pointer; }
  @media print { .btn { display: none; } body { padding: 0; } }
</style></head><body>
<button class="btn" onclick="window.print()">Print</button>
<div class="head">
  <div><h1>BLISSYNEST</h1><div class="muted">Packing slip</div></div>
  <div style="text-align:right"><strong>${escapeHtml(order.orderNumber)}</strong><div class="muted">${order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div></div>
</div>
<h2>Ship to</h2>
<div style="font-size:15px;line-height:1.5">${addressLines.map(escapeHtml).join("<br>")}</div>
<h2>Items</h2>
<table>${rows}</table>
${
  showPrices
    ? `<table class="totals" style="margin-top:10px">
  <tr><td>Subtotal</td><td class="num">${money(order.subtotal)}</td></tr>
  ${order.discount > 0 ? `<tr><td>Discount</td><td class="num">-${money(order.discount)}</td></tr>` : ""}
  <tr><td>Shipping</td><td class="num">${order.shippingCost === 0 ? "Free" : money(order.shippingCost)}</td></tr>
  <tr><td><strong>Total${order.paymentMethod === "COD" ? " (collect on delivery)" : ""}</strong></td><td class="num"><strong>${money(order.total)}</strong></td></tr>
</table>`
    : `<p class="muted">Prices hidden — gift order.</p>`
}
${order.isGift ? `<h2>Gift message</h2><div class="gift">${order.giftNote ? escapeHtml(order.giftNote).replace(/\n/g, "<br>") : "<em>No message added</em>"}</div>` : ""}
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
