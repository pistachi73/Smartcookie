import { db } from "@/db";
import { type InsertUser, type User, user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { hashPassword } from "./utils";

export const getUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  return await db.query.user.findFirst({
    where: eq(user.email, email),
  });
};

export const getUserById = async (id: string) => {
  return await db.query.user.findFirst({
    where: eq(user.id, id),
  });
};

export const createUser = async (values: InsertUser & { password: string }) => {
  const { hashedPassword, salt } = await hashPassword(values.password);

  const [creatdUser] = await db
    .insert(user)
    .values({
      ...values,
      password: hashedPassword,
      salt,
    })
    .returning();

  return creatdUser;
};

export const deleteUser = async (id: string, trx = db) => {
  await trx.delete(user).where(eq(user.id, id));
};

export const updateUser = async (
  id: string,
  values: Partial<User>,
  trx = db,
) => {
  const [updatedUser] = await trx
    .update(user)
    .set(values)
    .where(eq(user.id, id))
    .returning();

  return updatedUser;
};

export const updateUserPassword = async (
  userId: string,
  password: string,
  trx = db,
) => {
  const { hashedPassword, salt } = await hashPassword(password);
  await updateUser(userId, { password: hashedPassword, salt }, trx);
};

export const verifyPassword = async (
  plainTextPassword: string,
  salt: string,
  hashedPassword: string,
) => {
  const { hashedPassword: hash } = await hashPassword(plainTextPassword, salt);
  return hashedPassword === hash;
};
