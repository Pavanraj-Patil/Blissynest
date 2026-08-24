import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Once the real Hostinger MySQL connection cap is known, pass a pool
// config object instead of a bare string to set `connectionLimit` on it —
// this app runs as one persistent Node process (not serverless), so a
// small, reused pool is all it will ever need; no reason to guess a number
// before there's a real plan to size it against.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
