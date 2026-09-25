// One-off pre-launch clean-up of TEST data in the database this app points at
// (DATABASE_URL in .env). Run it yourself, once, when you are sure:
//
//   npx tsx scripts/cleanup-test-data.ts --yes
//
// What it does (all in one transaction, after saving a JSON backup next to
// this file as cleanup-backup-<timestamp>.json):
//   - deletes EVERY order and order line, and gives their stock back
//   - resets coupon "used" counters to 0
//   - deletes the five test accounts listed below (their addresses, carts and
//     wishlists go with them); real accounts and admins are left alone
//   - deletes reviews written by those accounts or tied to those orders, and
//     hides (rejects) every remaining approved review — the demo reviews —
//     so no invented ratings show on the store; Admin -> Reviews can bring
//     any of them back
//   - recomputes every product's rating from the reviews that remain
//
// Without --yes it only prints what it would touch.
import "dotenv/config";
import fs from "fs";
import path from "path";

const CONFIRMED = process.argv.includes("--yes");
const BACKUP = path.join(__dirname, `cleanup-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
const TEST_USER_EMAILS = [
  "testshopper@example.com",
  "qa-new-user@example.com",
  "customer@example.com",
  "testuser2@gmail.com",
  "kandi@kandi.com",
];

async function main() {
  const { db } = await import("../src/lib/db");
  const { recomputeProductRating } = await import("../src/lib/review-service");

  const orders = await db.order.findMany({ include: { items: true } });
  const users = await db.user.findMany({ where: { email: { in: TEST_USER_EMAILS } } });
  const userIds = users.map((u) => u.id);
  const reviews = await db.review.findMany();
  console.log(`Would delete ${orders.length} orders, ${users.length} test users (${users.map((u) => u.email).join(", ")}); ${reviews.length} reviews affected.`);
  if (!CONFIRMED) {
    console.log("Nothing changed. Re-run with --yes to do it.");
    await db.$disconnect();
    return;
  }
  fs.writeFileSync(BACKUP, JSON.stringify({ orders, users, reviews, takenAt: new Date().toISOString() }, null, 1));
  console.log(`Backup written to ${BACKUP}`);

  await db.$transaction(async (tx) => {
    // 1. Give stock back for orders that were still holding it.
    for (const o of orders) {
      if (o.status === "CANCELLED") continue;
      for (const item of o.items) {
        if (!item.productId) continue;
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity }, inStock: true },
        });
      }
    }
    // 2. Coupon use counters back to zero.
    await tx.coupon.updateMany({ data: { usedCount: 0 } });
    // 3. Reviews written by the deleted users (or tied to deleted orders) go;
    //    the remaining demo reviews are hidden (rejected) rather than deleted.
    const orderIds = orders.map((o) => o.id);
    const del = await tx.review.deleteMany({ where: { OR: [{ userId: { in: userIds } }, { orderId: { in: orderIds } }] } });
    const hide = await tx.review.updateMany({ where: { status: "APPROVED" }, data: { status: "REJECTED" } });
    console.log(`reviews deleted: ${del.count}, hidden: ${hide.count}`);
    // 4. Orders and their lines.
    await tx.orderItem.deleteMany({});
    const delOrders = await tx.order.deleteMany({});
    console.log(`orders deleted: ${delOrders.count}`);
    // 5. Test users (cascades their addresses, carts, wishlists, sessions, accounts, reset tokens).
    const delUsers = await tx.user.deleteMany({ where: { id: { in: userIds } } });
    console.log(`users deleted: ${delUsers.count}`);
  });

  const products = await db.product.findMany({ select: { id: true } });
  for (const p of products) await recomputeProductRating(p.id);
  console.log("ratings recomputed for", products.length, "products");

  console.log("remaining users:", (await db.user.findMany({ select: { email: true, role: true } })).map((u) => `${u.email}:${u.role}`).join(", "));
  await db.$disconnect();
}
main();
