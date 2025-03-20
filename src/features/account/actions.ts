"use server";

import { getPgTimezones } from "@/data-access/pg";
import { updateUser } from "@/data-access/user";
import { protectedAction, publicAction } from "@/shared/lib/safe-action";

import {
  updateUserEmailUseCase,
  updateUserPasswordUseCase,
} from "@/features/auth/use-cases";
import { deleteUser } from "../../data-access/user";
import {
  UpdateEmailSchema,
  UpdateNameSchema,
  UpdatePasswordSchema,
  UpdateTFASchema,
} from "./lib/validation";

export const updateUserEmailAction = protectedAction
  .schema(UpdateEmailSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { email, verificationToken } = parsedInput;
    const { user } = ctx;
    return await updateUserEmailUseCase(user.id, email, verificationToken);
  });

export const updateUserNameAction = protectedAction
  .schema(UpdateNameSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { name } = parsedInput;
    const { user } = ctx;
    return await updateUser(user.id, { name });
  });

export const updateTFAAction = protectedAction
  .schema(UpdateTFASchema)
  .action(async ({ ctx, parsedInput }) => {
    const { isTwoFactorEnabled } = parsedInput;
    const { user } = ctx;
    return await updateUser(user.id, { isTwoFactorEnabled });
  });

export const updateUserPasswordAction = protectedAction
  .schema(UpdatePasswordSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { currentPassword, newPassword } = parsedInput;
    const { user } = ctx;

    return await updateUserPasswordUseCase({
      userId: user.id,
      currentPassword,
      newPassword,
    });
  });

export const deleteUserAction = protectedAction.action(async ({ ctx }) => {
  const { user } = ctx;
  return await deleteUser(user.id);
});

export const getPgTimezonesAction = publicAction.action(async () => {
  return await getPgTimezones();
});
