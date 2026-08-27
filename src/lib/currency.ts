const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Every price in the database is stored as integer paise, never a float —
// this is the one place that conversion to a displayable rupee amount
// should happen. See prisma/schema.prisma's header comment.
export function formatPaise(paise: number): string {
  return inrFormatter.format(paise / 100);
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}

export function discountPercent(basePrice: number, compareAtPrice: number): number {
  return Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100);
}
