"use server";

import { AuthError } from "next-auth";
import { hashPassword } from "../utils";

import { signIn } from "@/core/config/auth-config";
import { createDataAccessError, isDataAccessError } from "@/data-access/errors";
import { getPasswordResetTokenByToken } from "@/data-access/password-reset-token/queries";
import { withValidationOnly } from "@/data-access/protected-data-access";
import { generateTwoFactorConfirmation } from "@/data-access/two-factor-confirmation/mutations";
import {
  deleteTwoFactorTokenByToken,
  sendTwoFactorEmail,
} from "@/data-access/two-factor-token/mutations";
import { getTwoFactorTokenByEmail } from "@/data-access/two-factor-token/queries";
import { createUser, updateUserPassword } from "@/data-access/user/mutations";
import { getUserByEmail } from "@/data-access/user/queries";
import { sendEmailVerificationEmail } from "@/data-access/verification-token/mutations";
import { getVerificationTokenByTokenAndEmail } from "@/data-access/verification-token/queries";
import { db } from "@/db";
import { sendPasswordResetEmail } from "@/shared/lib/mail";
import {
  deletePasswordResetTokenByToken,
  generatePasswordResetToken,
} from "../password-reset-token/mutations";
import {
  ChangePasswordSchema,
  CredentialsSignInSchema,
  CredentialsSignUpSchema,
  ResetPasswordSchema,
  VerifyPasswordSchema,
} from "./schemas";

export const verifyPassword = withValidationOnly({
  schema: VerifyPasswordSchema,
  callback: async ({ plainTextPassword, salt, hashedPassword }) => {
    const { hashedPassword: hash } = await hashPassword(
      plainTextPassword,
      salt,
    );

    return hashedPassword === hash;
  },
});

export const credentialsSignIn = withValidationOnly({
  schema: CredentialsSignInSchema,
  callback: async (data) => {
    try {
      const { email, password, code } = data;
      const user = await getUserByEmail({ email });

      if (!user || !user.salt || !user.password) {
        return createDataAccessError("NOT_FOUND");
      }

      const passwordsMatch = await verifyPassword({
        plainTextPassword: password,
        salt: user.salt,
        hashedPassword: user.password,
      });

      if (!passwordsMatch) {
        return createDataAccessError("INVALID_LOGIN");
      }

      if (user.isTwoFactorEnabled && user.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail({ email });
          if (!twoFactorToken || twoFactorToken.token !== code) {
            return createDataAccessError("INVALID_TOKEN");
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return createDataAccessError("TOKEN_EXPIRED");
          }

          await Promise.all([
            deleteTwoFactorTokenByToken({ token: code }),
            generateTwoFactorConfirmation({
              userId: user.id,
            }),
          ]);
        } else {
          const result = await sendTwoFactorEmail({ email: user.email });
          if (isDataAccessError(result)) {
            return createDataAccessError("EMAIL_SENDING_FAILED");
          }
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
              return createDataAccessError("INVALID_LOGIN");
          }
        }

        return createDataAccessError(
          "DATABASE_ERROR",
          "Something went wrong! Please try again.",
        );
      }

      return {
        twoFactor: null,
      };
    } catch (error) {
      return {
        twoFactor: null,
      };
    }
  },
});

export const credentialsSignUp = withValidationOnly({
  schema: CredentialsSignUpSchema,
  callback: async ({ email, password, emailVerificationCode }) => {
    let existingUser = await getUserByEmail({ email });

    if (existingUser) {
      return createDataAccessError("DUPLICATE_RESOURCE");
    }

    if (!emailVerificationCode) {
      const result = await sendEmailVerificationEmail({ email });
      if (isDataAccessError(result)) {
        return createDataAccessError("EMAIL_SENDING_FAILED");
      }

      return { emailVerification: true, user: null };
    }

    const existingToken = await getVerificationTokenByTokenAndEmail({
      token: emailVerificationCode,
      email,
    });

    if (!existingToken) {
      return createDataAccessError("INVALID_TOKEN");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return createDataAccessError("TOKEN_EXPIRED");
    }

    existingUser = await getUserByEmail({ email: existingToken.email });

    if (existingUser) {
      return createDataAccessError("DUPLICATE_RESOURCE");
    }

    const createdUserResult = await createUser({
      data: {
        email,
        name: email.split("@")[0],
        password,
      },
    });

    if (!createdUserResult) {
      return createDataAccessError("DATABASE_ERROR");
    }

    return { emailVerification: false, user: createdUserResult };
  },
});

export const resetPassword = withValidationOnly({
  schema: ResetPasswordSchema,
  callback: async ({ email }) => {
    const existingUser = await getUserByEmail({ email });

    if (!existingUser) {
      return createDataAccessError("NOT_FOUND");
    }

    const passwordResetToken = await generatePasswordResetToken({ email });

    if (!passwordResetToken) {
      return createDataAccessError(
        "DATABASE_ERROR",
        "Error generating password reset token",
      );
    }

    try {
      await sendPasswordResetEmail({
        token: passwordResetToken.token,
        email: passwordResetToken.email,
      });
    } catch (e) {
      return createDataAccessError("EMAIL_SENDING_FAILED");
    }

    return true;
  },
});

export const changePassword = withValidationOnly({
  schema: ChangePasswordSchema,
  callback: async ({ token, password }) => {
    const existingToken = await getPasswordResetTokenByToken({ token });

    if (!existingToken) {
      return createDataAccessError("INVALID_TOKEN");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return createDataAccessError("TOKEN_EXPIRED");
    }

    const existingUser = await getUserByEmail({ email: existingToken.email });

    if (!existingUser) {
      return createDataAccessError("NOT_FOUND");
    }

    await db.transaction(async (trx) => {
      await Promise.all([
        deletePasswordResetTokenByToken({ token, trx }),
        updateUserPassword({
          trx,
          data: {
            userId: existingUser.id,
            password,
          },
        }),
      ]);
    });

    return true;
  },
});
