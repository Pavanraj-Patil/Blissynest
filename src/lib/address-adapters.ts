import type { Address as PrismaAddress } from "@/generated/prisma/client";
import type { Address } from "@/lib/checkout-data";

export function toAddressDTO(a: PrismaAddress): Address {
  return {
    id: a.id,
    label: a.label,
    name: a.name,
    line1: a.line1,
    line2: a.line2 ?? undefined,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
  };
}
