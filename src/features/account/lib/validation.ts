import { z } from "zod";

export const UpdateEmailSchema = z.object({
  newEmail: z.string().email({
    message: "Email is required",
  }),
  verificationToken: z.string().optional(),
});

export const UpdateNameSchema = z.object({
  name: z.string(),
});

export const UpdateTFASchema = z.object({
  isTwoFactorEnabled: z.boolean(),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string({
      required_error: "Current password is required!",
    }),
    newPassword: z.string({ required_error: "New password is required!" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required!",
    }),
  })

  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match!",
  });
