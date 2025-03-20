import {
  deletePasswordResetTokenByToken,
  getPasswordResetTokenByToken,
} from "@/data-access/password-reset-token";
import { getUserByEmail, updateUserPassword } from "@/data-access/user";
import { createTransaction } from "@/data-access/utils";
import {
  InvalidTokenError,
  PublicError,
  TokenExpiredError,
} from "@/shared/services/errors";

export async function changePasswordUseCase({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const existingToken = await getPasswordResetTokenByToken({ token });

  if (!existingToken) {
    throw new InvalidTokenError();
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new TokenExpiredError();
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new PublicError("Email does not exist!");
  }

  await createTransaction(async (trx) => {
    await deletePasswordResetTokenByToken(token, trx);
    await updateUserPassword(existingUser.id, password, trx);
  });

  return { success: "Password updated!" };
}
