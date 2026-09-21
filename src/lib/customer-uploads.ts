// Shoppers' own photos (for products that let them upload images as part of
// the customisation) live under this key prefix in the R2 bucket, served from
// the bucket's public URL.
export const CUSTOMER_UPLOAD_KEY_PREFIX = "customer-uploads/";

function publicBase(): string | null {
  const base = process.env.R2_PUBLIC_URL;
  return base ? base.replace(/\/$/, "") : null;
}

export function customerUploadUrl(key: string): string | null {
  const base = publicBase();
  return base ? `${base}/${key}` : null;
}

// Cart/order payloads carry these URLs back from the browser, so they can't
// be trusted as-is: without this check a shopper could attach any URL (a
// tracking pixel, a phishing link) that then renders in the admin's order
// view. Only URLs inside our own upload prefix are accepted.
export function isCustomerUploadUrl(url: string): boolean {
  const base = publicBase();
  return base !== null && url.startsWith(`${base}/${CUSTOMER_UPLOAD_KEY_PREFIX}`);
}
