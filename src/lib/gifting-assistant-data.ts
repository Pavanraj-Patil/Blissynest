import type { AudienceSlug } from "@/lib/shop-mock-data";

export const whoOptions = ["Her", "Him", "Parents", "Couple", "Kids"];

export const whoToAudience: Record<string, AudienceSlug> = {
  Her: "her",
  Him: "him",
  Parents: "parents",
  Couple: "couples",
  Kids: "kids",
};

export const occasionOptions = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Housewarming",
  "Thank You",
];

export const budgetOptions = [
  "Under ₹1,000",
  "₹1,000–2,000",
  "₹2,000–5,000",
  "₹5,000+",
];

export const budgetToRange: Record<string, [number, number]> = {
  "Under ₹1,000": [0, 999],
  "₹1,000–2,000": [1000, 2000],
  "₹2,000–5,000": [2000, 5000],
  "₹5,000+": [5000, Infinity],
};
