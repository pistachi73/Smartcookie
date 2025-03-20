import { createUser, getUserByEmail } from "@/data-access/user";
import {
  getVerificationTokenByToken,
  sendEmailVerificationEmail,
} from "@/data-access/verification-token";
import {
  InvalidTokenError,
  PublicError,
  TokenExpiredError,
} from "@/shared/services/errors";

export const registerUseCase = async ({
  email,
  password,
  emailVerificationCode,
}: {
  email: string;
  password: string;
  emailVerificationCode?: string;
}) => {
  let existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new PublicError("Email already in use!");
  }

  if (!emailVerificationCode) {
    await sendEmailVerificationEmail(email);
    return { emailVerification: true, user: null };
  }

  const existingToken = await getVerificationTokenByToken(
    emailVerificationCode,
  );

  if (!existingToken) {
    throw new InvalidTokenError();
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new TokenExpiredError();
  }

  existingUser = await getUserByEmail(existingToken.email);

  if (existingUser) {
    throw new PublicError("Email already in use!");
  }

  const createdUser = await createUser({
    email,
    name: email.split("@")[0],
    password,
  });

  return { emailVerification: false, user: createdUser };
};
