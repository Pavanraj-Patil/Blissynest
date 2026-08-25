import { z } from "zod";

export const leadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "CONVERTED", "CLOSED"]),
});
