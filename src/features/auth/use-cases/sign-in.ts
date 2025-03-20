import { signIn } from "@/core/config/auth-config";
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
import { getUserByEmail, verifyPassword } from "@/data-access/user";
import {
  InvalidTokenError,
  LoginError,
  PublicError,
  TokenExpiredError,
} from "@/shared/services/errors";
import { AuthError } from "next-auth";

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
