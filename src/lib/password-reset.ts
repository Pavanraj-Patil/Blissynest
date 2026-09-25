import { createHash } from "crypto";

// Only this hash is stored; the raw token lives in the emailed link alone.
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const RESET_TOKEN_LIFETIME_MS = 60 * 60 * 1000;
