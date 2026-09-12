import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = new URL(process.env.DATABASE_URL!);

function createRawClient(): PrismaClient {
  const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname || "127.0.0.1",
    port: Number(databaseUrl.port) || 3306,
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.slice(1),
    connectionLimit: 5,
    acquireTimeout: 30000,
    connectTimeout: 10000,
    // MySQL 8's default auth plugin (caching_sha2_password) needs the
    // server's RSA public key to hash the password when the connection
    // isn't already TLS-encrypted — without this, every connection hangs
    // until acquireTimeout and the pool reports a generic "0 connections"
    // error that gives no hint this is an auth handshake problem. Safe
    // over loopback-only local dev; irrelevant once a real deployment
    // terminates TLS in front of MySQL.
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({ adapter });
}

// Only the genuine "couldn't get a connection" pool timeout should trigger
// a swap. Deliberately excludes "pool is ending" (driver code 45037) —
// that's what every OTHER in-flight request against the same client sees
// the instant this file's own $disconnect() call (below) fires, so treating
// it as a fresh trigger would cascade: each of N concurrent requests
// re-detects "failure" on the client that's being torn down and tries to
// swap again.
function isPoolTimeoutError(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("code" in err) || err.code !== "P2039") {
    return false;
  }
  const message = "message" in err && typeof err.message === "string" ? err.message : "";
  return message.includes("pool timeout");
}

// The mariadb pool behind the adapter can get stuck reporting
// active=0/idle=0 after the local MySQL container is briefly unreachable
// (e.g. Docker Desktop/WSL restarting) — it never recovers on its own even
// once MySQL is back, previously requiring a manual `next dev` restart. In
// dev only, detect that failure and swap in a fresh client so the next
// request self-heals instead of every request hanging for 30s forever.
function buildClient(): PrismaClient {
  const raw = createRawClient();
  if (process.env.NODE_ENV === "production") return raw;

  // Guards against concurrent requests against the SAME stale client each
  // independently triggering their own swap/disconnect: `swapped` is local
  // to this one client instance (only the first failure against it acts),
  // and `db === extended` additionally confirms this client is still the
  // active global one before tearing it down (a slow late failure from an
  // already-superseded client must not disconnect whatever replaced it).
  let swapped = false;
  const extended = raw.$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err) {
          if (isPoolTimeoutError(err) && !swapped && db === extended) {
            swapped = true;
            const stale = db;
            db = buildClient();
            globalForPrisma.prisma = db;
            void stale.$disconnect().catch(() => {});
          }
          throw err;
        }
      },
    },
  }) as PrismaClient;

  return extended;
}

export let db: PrismaClient = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}