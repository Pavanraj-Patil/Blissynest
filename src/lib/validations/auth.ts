import { z } from "zod";

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be under 128 characters")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/[0-9]/, "Password must include at least one number");

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().toLowerCase().max(191).email("Enter a valid email address"),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const passwordLoginSchema = z.object({
  email: z.string().trim().toLowerCase().max(191).email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password").max(128),
});

export type PasswordLoginInput = z.infer<typeof passwordLoginSchema>;
