import { eq } from "drizzle-orm";

import { TOKEN_LENGTH } from "@/app-config";
import { db } from "@/db";
import { twoFactorConirmation } from "@/db/schema";
import { generateRandomToken } from "./utils";

export const getTwoFactorConirmationByUserId = async (userId: string) => {
  try {
    return await db.query.twoFactorConirmation.findFirst({
      where: eq(twoFactorConirmation.userId, userId),
    });
  } catch {
    return null;
  }
};

export const deleteTwoFactorConfirmationByToken = async (token: string) => {
  await db
    .delete(twoFactorConirmation)
    .where(eq(twoFactorConirmation.token, token));
};

export const createTwoFactorConfirmation = async (userId: string) => {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const [createdTwoFactorConfirmation] = await db
    .insert(twoFactorConirmation)
    .values({
      token,
      userId,
    })
    .returning();

  return createdTwoFactorConfirmation;
};
