import { AuthError } from "next-auth";

import { signIn } from "@/auth-config";
import { getAccountByUserId } from "@/data-access/account";
import {
  deletePasswordResetTokenByToken,
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
} from "@/data-access/password-reset-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmationByToken,
  getTwoFactorConirmationByUserId,
} from "@/data-access/two-factor-confirmation";
import {
  deleteTwoFactorTokenByToken,
  getTwoFactorTokenByEmail,
  sendTwoFactorEmail,
} from "@/data-access/two-factor-token";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserPassword,
  verifyPassword,
} from "@/data-access/user";
import { createTransaction } from "@/data-access/utils";
import {
  getVerificationTokenByToken,
  sendEmailVerificationEmail,
} from "@/data-access/verification-token";
import { sendPasswordResetEmail } from "@/lib/mail";
import {
  InvalidTokenError,
  LoginError,
  PublicError,
  TokenExpiredError,
} from "./errors";

export const signInUseCase = async ({
  email,
  password,
  code,
}: {
  email: string;
  password: string;
  code?: string;
}) => {
  const user = await getUserByEmail(email);

  if (!user || !user.salt || !user.password) {
    throw new PublicError("Email does not exist!");
  }

  const passwordsMatch = await verifyPassword(
    password,
    user.salt,
    user.password,
  );

  if (!passwordsMatch) {
    throw new LoginError();
  }

  const a = "123456";

  if (user.isTwoFactorEnabled && user.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail({ email });
      if (!twoFactorToken || twoFactorToken.token !== code) {
        throw new InvalidTokenError();
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        throw new TokenExpiredError();
      }

      await deleteTwoFactorTokenByToken(code);

      const existingConfirmation = await getTwoFactorConirmationByUserId(
        user.id,
      );

      if (existingConfirmation) {
        await deleteTwoFactorConfirmationByToken(existingConfirmation.token);
      }

      await createTwoFactorConfirmation(user.id);
    } else {
      await sendTwoFactorEmail(user.email);
      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new LoginError();
      }
    }

    throw new PublicError("Something went wrong!");
  }

  return {
    twoFactor: null,
  };
};

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

export const resetPasswordUseCase = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new PublicError("Email not found!");
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) {
    throw new PublicError("Something went wrong!");
  }

  try {
    await sendPasswordResetEmail({
      token: passwordResetToken.token,
      email: passwordResetToken.email,
    });
  } catch (e) {
    throw new PublicError("Something went wrong, please try again later.");
  }

  return { success: "Reset email sent!" };
};

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

export const updateUserUseCase = () => {};

export const getUserAndAccountByEmailUseCase = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) return { user: null, account: null };

  const account = await getAccountByUserId(user.id);

  return { user, account };
};

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

export const updateUserPasswordUseCase = async ({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const user = await getUserById(userId);

  if (!user?.salt || !user.password) {
    throw new PublicError("User not found!");
  }

  const passwordsMatch = verifyPassword(
    currentPassword,
    user.salt,
    user.password,
  );

  if (!passwordsMatch) {
    throw new PublicError("Incorrect password!");
  }

  await updateUserPassword(userId, newPassword);
};
