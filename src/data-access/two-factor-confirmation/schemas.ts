import { z } from "zod";

export const getTwoFactorConfirmationByUserIdSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const deleteTwoFactorConfirmationByTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const createTwoFactorConfirmationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});
