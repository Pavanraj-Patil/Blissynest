import type { ZodError } from "zod";

// One human-readable sentence for the first thing wrong with a request.
// Zod's own wording for a missing field ("Invalid input: expected string,
// received undefined") never says WHICH field, so those are rewritten to name
// it; messages we wrote ourselves ("Name is required") pass through untouched.
export function firstIssueMessage(error: ZodError, fallback = "Invalid request"): string {
  const issue = error.issues[0];
  if (!issue) return fallback;
  if (/^Invalid input: expected/i.test(issue.message)) {
    const last = issue.path[issue.path.length - 1];
    if (typeof last === "string" && last) {
      const words = last.replace(/([A-Z])/g, " $1").toLowerCase();
      return `Please fill in "${words.charAt(0).toUpperCase()}${words.slice(1)}".`;
    }
    return fallback;
  }
  return issue.message;
}
