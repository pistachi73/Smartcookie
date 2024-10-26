"use server";

import { sendTwoFactorEmail } from "@/data-access/two-factor-token";
import { sendEmailVerificationEmail } from "@/data-access/verification-token";
import { publicAction } from "@/lib/safe-action";
import {
  changePasswordUseCase,
  getUserAndAccountByEmailUseCase,
  registerUseCase,
  resetPasswordUseCase,
  signInUseCase,
} from "@/use-cases/user";
import { z } from "zod";
import { RegisterSchema, SignInSchema } from "./validation";

export const getUserAndAccountByEmailAction = publicAction
  .schema(z.string())
  .action(async ({ parsedInput: email }) => {
    return await getUserAndAccountByEmailUseCase(email);
  });

export const signInAction = publicAction
  .schema(SignInSchema)
  .action(async ({ parsedInput }) => {
    return await signInUseCase(parsedInput);
  });

export const registerAction = publicAction
  .schema(RegisterSchema)
  .action(async ({ parsedInput }) => {
    return await registerUseCase(parsedInput);
  });

export const resetPasswordAction = publicAction
  .schema(z.string().email())
  .action(async ({ parsedInput: email }) => {
    return await resetPasswordUseCase(email);
  });

export const changePasswordAction = publicAction
  .schema(z.object({ token: z.string(), password: z.string() }))
  .action(async ({ parsedInput: { token, password } }) => {
    return await changePasswordUseCase({ token, password });
  });

export const resendTwoFactorVerificationEmailAction = publicAction
  .schema(z.string())
  .action(async ({ parsedInput: email }) => {
    return await sendTwoFactorEmail(email);
  });

export const resendEmailVerificationEmailAction = publicAction
  .schema(z.string())
  .action(async ({ parsedInput: email }) => {
    return await sendEmailVerificationEmail(email);
  });
