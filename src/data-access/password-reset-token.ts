import { eq } from "drizzle-orm";

import { TOKEN_LENGTH } from "@/core/config/app-config";
import { db } from "@/db";
import { type InsertPasswordResetToken, passwordResetToken } from "@/db/schema";
import { generateRandomToken } from "./utils";

export const getPasswordResetTokenByToken = async ({
  token,
}: { token: string }) => {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  } catch {
    return null;
  }
};

export const createPasswordResetToken = async (
  data: InsertPasswordResetToken,
) => {
  const [createdToken] = await db
    .insert(passwordResetToken)
    .values(data)
    .returning();
  return createdToken;
};

export const deletePasswordResetTokenByToken = async (
  token: string,
  trx = db,
) => {
  await trx
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.token, token));
};

export const generatePasswordResetToken = async (email: string) => {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetTokenByToken(existingToken.token);
  }

  return await createPasswordResetToken({ token, email, expires });
};
