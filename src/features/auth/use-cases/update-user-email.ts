import { getUserById, updateUser } from "@/data-access/user";
import {
  getVerificationTokenByToken,
  sendEmailVerificationEmail,
} from "@/data-access/verification-token";
import {
  InvalidTokenError,
  PublicError,
  TokenExpiredError,
} from "@/shared/services/errors";

export const updateUserEmailUseCase = async (
  userId: string,
  newEmail: string,
  verificationToken?: string,
) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new PublicError("User not found!");
  }

  if (!user.email || user.email === newEmail) {
    throw new PublicError("Email must be different!");
  }

  if (!verificationToken) {
    await sendEmailVerificationEmail(user.email);
    return {
      verifyEmail: true,
    };
  }

  const existingToken = await getVerificationTokenByToken(verificationToken);

  if (!existingToken) {
    throw new InvalidTokenError();
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new TokenExpiredError();
  }

  await updateUser(user.id, { email: newEmail });

  return {
    verifyEmail: false,
  };
};
