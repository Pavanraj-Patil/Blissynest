import { NextResponse } from "next/server";

// In-memory, fixed-window rate limiting. Disclosed limitation: counts reset
// on process restart, and this under-counts if the app is ever
// horizontally scaled across multiple serverless instances — acceptable for
// now, revisit with a shared store (e.g. Upstash Redis) before that changes,
// since Vercel's serverless functions don't share this in-memory Map across
// invocations the way a single persistent Node process would.
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Piggybacks a sweep of expired buckets onto normal traffic rather than
// running a timer — cheap, and keeps the Map from growing unboundedly.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = Date.now();

function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

// `key` should already include a route identifier (e.g. "auth-signup:1.2.3.4")
// so two different routes rate-limiting the same IP never collide.
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export function tooManyRequestsResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests — please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
