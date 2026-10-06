import { z } from "zod";
import { passwordField } from "./auth";
import { phoneField } from "./common";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().max(191).email("Enter a valid email address"),
  phone: phoneField,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: passwordField,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateNotificationsSchema = z.object({
  orders: z.boolean(),
  promos: z.boolean(),
  recs: z.boolean(),
});

export type UpdateNotificationsInput = z.infer<typeof updateNotificationsSchema>;
