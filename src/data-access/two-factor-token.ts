import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { sendTwoFactorTokenEmail } from "@/shared/lib/mail";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByToken = async ({
  token,
}: { token: string }) => {
  try {
    return await db.query.twoFactorToken.findFirst({
      where: eq(twoFactorToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async ({
  email,
}: { email: string }) => {
  try {
    return await db.query.twoFactorToken.findFirst({
      where: eq(twoFactorToken.email, email),
    });
  } catch {
    return null;
  }
};

export const deleteTwoFactorTokenByToken = async (token: string) => {
  await db.delete(twoFactorToken).where(eq(twoFactorToken.token, token));
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail({ email });

  if (existingToken) {
    await deleteTwoFactorTokenByToken(existingToken.token);
  }

  const data = { token, email, expires };

  await db.insert(twoFactorToken).values(data);

  return data;
};

export const sendTwoFactorEmail = async (email: string) => {
  const twoFactorToken = await generateTwoFactorToken(email);

  try {
    await sendTwoFactorTokenEmail({
      token: twoFactorToken.token,
      email,
    });
  } catch (error) {
    console.error("Two Factor email couldn't be send", error);
    return false;
  }

  return true;
};
