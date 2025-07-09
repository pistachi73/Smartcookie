import { z } from "zod";

export const CredentialsSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  code: z.string().optional(),
});

export const CredentialsSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  emailVerificationCode: z.string().optional(),
});

export const VerifyPasswordSchema = z.object({
  plainTextPassword: z.string(),
  salt: z.string(),
  hashedPassword: z.string(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const ChangePasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
});

export const UpdateUserAccountEmailSchema = z.object({
  newEmail: z.string().email(),
  verificationToken: z.string().optional(),
});

export const UpdateUserAccountPasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
