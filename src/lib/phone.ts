// Indian mobile-number and pincode rules, shared by the browser forms and the
// server-side validators so both always agree on what "valid" means.

export const PHONE_ERROR = "Enter a valid 10-digit mobile number";
export const PINCODE_ERROR = "Enter a valid 6-digit pincode";

// Accepts what people actually type — "98765 43210", "+91 98765-43210",
// "091234 56789", "(98765) 43210" — and returns the bare 10 digits, or null
// when it isn't an Indian mobile number (10 digits, starting 6-9).
export function normalizeIndianMobile(input: string): string | null {
  const stripped = input.trim().replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(stripped)) return null;
  let digits = stripped.replace(/^\+/, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function isValidIndianMobile(input: string): boolean {
  return normalizeIndianMobile(input) !== null;
}

export function isValidPincode(input: string): boolean {
  return /^[1-9]\d{5}$/.test(input.trim());
}
