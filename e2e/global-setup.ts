import "dotenv/config";
import mariadb from "mariadb";

// The suite places real guest orders, and each one takes stock from the test
// products for good — after a few runs the personalisable hamper is sold out
// and its tests fail for a reason that has nothing to do with the app. Put the
// fixtures back to a healthy stock level before every run.
//
// Plain SQL through the mariadb driver (rather than the app's Prisma client,
// which is ESM-only and can't be loaded by Playwright's runner).
export default async function globalSetup() {
  const url = new URL(process.env.DATABASE_URL!);
  const conn = await mariadb.createConnection({
    host: url.hostname || "127.0.0.1",
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    allowPublicKeyRetrieval: true,
  });
  try {
    await conn.query(
      "UPDATE `Product` SET stockQuantity = 50, inStock = 1 WHERE slug IN ('test-personalisable-hamper', 'test-pre-built-hamper')"
    );
  } finally {
    await conn.end();
  }
}
