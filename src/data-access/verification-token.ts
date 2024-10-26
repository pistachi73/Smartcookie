import { eq } from "drizzle-orm";

import { db } from "@/db";
import { verificationToken } from "@/db/schema";
import { sendVerificationEmail } from "@/lib/mail";
import { PublicError } from "@/use-cases/errors";
import crypto from "crypto";
import { getUserByEmail } from "./user";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.query.verificationToken.findFirst({
      where: eq(verificationToken.token, token),
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async ({
  email,
}: { email: string }) => {
  try {
    return await db.query.verificationToken.findFirst({
      where: eq(verificationToken.email, email),
    });
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getVerificationTokenByEmail({ email });

  if (existingToken) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.email, email));
  }

  const data = { token, email, expires };
  await db.insert(verificationToken).values(data);

  return data;
};

export const sendEmailVerificationEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new PublicError("User not found!");
  }

  const verificationToken = await generateVerificationToken(email);

  try {
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });
  } catch (e) {
    console.error("Error sending verification email", e);
    return false;
  }

  return true;
};
