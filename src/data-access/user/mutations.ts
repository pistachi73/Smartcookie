"use server";

import { eq } from "drizzle-orm";

import {
  withAuthenticationNoInput,
  withValidationOnly,
} from "@/data-access/protected-data-access";
import { db } from "@/db";
import { user } from "@/db/schema";
import { hashPassword } from "../utils";
import {
  CreateUserSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
} from "./schemas";

export const createUser = withValidationOnly({
  schema: CreateUserSchema,
  callback: async ({ data: { password, ...values }, trx = db }) => {
    const { hashedPassword, salt } = await hashPassword(password);

    const [createdUser] = await trx
      .insert(user)
      .values({
        ...values,
        password: hashedPassword,
        salt,
      })
      .returning();

    return createdUser;
  },
});

export const updateUser = withValidationOnly({
  schema: UpdateUserSchema,
  callback: async ({ trx = db, id, data }) => {
    const [updatedUser] = await trx
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  },
});

export const updateUserPassword = withValidationOnly({
  schema: UpdateUserPasswordSchema,
  callback: async ({ data: { userId, password }, trx = db }) => {
    const { hashedPassword, salt } = await hashPassword(password);
    await updateUser({
      id: userId,
      data: { password: hashedPassword, salt },
      trx,
    });
  },
});

export const deleteUser = withAuthenticationNoInput({
  callback: async (authUser) => {
    await db.delete(user).where(eq(user.id, authUser.id));
  },
});
