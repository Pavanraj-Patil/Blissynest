import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().default(""),
  limit: z.coerce.number().int().min(1).max(48).optional(),
});
