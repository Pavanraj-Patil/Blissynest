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
  });
  return new PrismaClient({ adapter });
}

function isPoolTimeoutError(err: unknown): boolean {
  return Boolean(
    err && typeof err === "object" && "code" in err && err.code === "P2039"
  );
}

// The mariadb pool behind the adapter can get stuck reporting
// active=0/idle=0 after the local MySQL container is briefly unreachable
// (e.g. Docker Desktop/WSL restarting) — it never recovers on its own even
// once MySQL is back, previously requiring a manual `next dev` restart. In
// dev only, detect that failure and swap in a fresh client so the next
// request self-heals instead of every request hanging for 30s forever.
function buildClient(): PrismaClient {
  const client = createRawClient();
  if (process.env.NODE_ENV === "production") return client;

  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err) {
          if (isPoolTimeoutError(err)) {
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
}

export let db: PrismaClient = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}