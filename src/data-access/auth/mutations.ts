"use server";

import { AuthError } from "next-auth";

import { sendPasswordResetEmail } from "@/shared/lib/mail";

import { signIn } from "@/core/config/auth-config";
import { createDataAccessError, isDataAccessError } from "@/data-access/errors";
import { getPasswordResetTokenByToken } from "@/data-access/password-reset-token/queries";
import { generateTwoFactorConfirmation } from "@/data-access/two-factor-confirmation/mutations";
import {
  deleteTwoFactorTokenByToken,
  sendTwoFactorEmail,
} from "@/data-access/two-factor-token/mutations";
import { getTwoFactorTokenByEmail } from "@/data-access/two-factor-token/queries";
import {
  createUser,
  updateUser,
  updateUserPassword,
} from "@/data-access/user/mutations";
import { getUserByEmail, getUserById } from "@/data-access/user/queries";
import { sendEmailVerificationEmail } from "@/data-access/verification-token/mutations";
import { getVerificationTokenByTokenAndEmail } from "@/data-access/verification-token/queries";
import { db } from "@/db";
import {
  deletePasswordResetTokenByToken,
  generatePasswordResetToken,
} from "../password-reset-token/mutations";
import { hashPassword } from "../utils";
import { withProtectedDataAccess } from "../with-protected-data-access";
import {
  ChangePasswordSchema,
  CredentialsSignInSchema,
  CredentialsSignUpSchema,
  ResetPasswordSchema,
  UpdateUserAccountEmailSchema,
  UpdateUserAccountPasswordSchema,
  VerifyPasswordSchema,
} from "./schemas";

export const verifyPassword = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: VerifyPasswordSchema,
  callback: async ({ plainTextPassword, salt, hashedPassword }) => {
    const { hashedPassword: hash } = await hashPassword(
      plainTextPassword,
      salt,
    );

    return hashedPassword === hash;
  },
});

export const credentialsSignIn = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: CredentialsSignInSchema,
  callback: async (data) => {
    try {
      const { email, password, code } = data;
      const userResult = await getUserByEmail({ email });

      if (isDataAccessError(userResult)) {
        console.log({ userResult });
        return userResult;
      }

      const user = userResult;

      if (!user || !user.salt || !user.password) {
        return createDataAccessError({
          type: "NOT_FOUND",
          message: "User not found",
        });
      }

      const passwordsMatch = await verifyPassword({
        plainTextPassword: password,
        salt: user.salt,
        hashedPassword: user.password,
      });

      if (!passwordsMatch) {
        return createDataAccessError({
          type: "INVALID_LOGIN",
          message: "Invalid email or password",
        });
      }

      if (user.isTwoFactorEnabled && user.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail({ email });
          if (!twoFactorToken || twoFactorToken.token !== code) {
            return createDataAccessError({
              type: "INVALID_TOKEN",
              message: "Invalid two-factor authentication code",
            });
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return createDataAccessError({
              type: "TOKEN_EXPIRED",
              message: "Two-factor authentication code has expired",
            });
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
            return createDataAccessError({
              type: "EMAIL_SENDING_FAILED",
              message: "Failed to send two-factor authentication email",
            });
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
              return createDataAccessError({
                type: "INVALID_LOGIN",
                message: "Invalid email or password",
              });
          }
        }

        return createDataAccessError({
          type: "DATABASE_ERROR",
          message: "Something went wrong! Please try again.",
        });
      }

      return {
        twoFactor: null,
      };
    } catch (_error) {
      return {
        twoFactor: null,
      };
    }
  },
});

export const credentialsSignUp = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: CredentialsSignUpSchema,
  callback: async ({ email, password, emailVerificationCode }) => {
    let existingUser = await getUserByEmail({ email });

    if (existingUser) {
      return createDataAccessError({
        type: "DUPLICATE_RESOURCE",
        message: "An account with this email already exists",
      });
    }

    if (!emailVerificationCode) {
      const result = await sendEmailVerificationEmail({ email });
      if (isDataAccessError(result)) {
        return createDataAccessError({
          type: "EMAIL_SENDING_FAILED",
          message: "Failed to send email verification",
        });
      }

      return { emailVerification: true, user: null };
    }

    const existingToken = await getVerificationTokenByTokenAndEmail({
      token: emailVerificationCode,
      email,
    });

    if (!existingToken) {
      return createDataAccessError({
        type: "INVALID_TOKEN",
        message: "Invalid verification token",
      });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return createDataAccessError({
        type: "TOKEN_EXPIRED",
        message: "Verification token has expired",
      });
    }

    existingUser = await getUserByEmail({ email: existingToken.email });

    if (existingUser) {
      return createDataAccessError({
        type: "DUPLICATE_RESOURCE",
        message: "An account with this email already exists",
      });
    }

    const createdUserResult = await createUser({
      data: {
        email,
        name: email.split("@")[0],
        password,
      },
    });

    if (!createdUserResult) {
      return createDataAccessError({
        type: "DATABASE_ERROR",
        message: "Failed to create user account",
      });
    }

    return { emailVerification: false, user: createdUserResult };
  },
});

export const resetPassword = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: ResetPasswordSchema,
  callback: async ({ email }) => {
    const existingUser = await getUserByEmail({ email });

    if (!existingUser) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "No account found with this email address",
      });
    }

    const passwordResetToken = await generatePasswordResetToken({ email });

    if (!passwordResetToken) {
      return createDataAccessError({
        type: "DATABASE_ERROR",
        message: "Error generating password reset token",
      });
    }

    try {
      await sendPasswordResetEmail({
        token: passwordResetToken.token,
        email: passwordResetToken.email,
      });
    } catch (_e) {
      return createDataAccessError({
        type: "EMAIL_SENDING_FAILED",
        message: "Failed to send password reset email",
      });
    }

    return true;
  },
});

export const changePassword = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: ChangePasswordSchema,
  callback: async ({ token, password }) => {
    const existingToken = await getPasswordResetTokenByToken({ token });

    if (!existingToken) {
      return createDataAccessError({
        type: "INVALID_TOKEN",
        message: "Invalid password reset token",
      });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return createDataAccessError({
        type: "TOKEN_EXPIRED",
        message: "Password reset token has expired",
      });
    }

    const existingUser = await getUserByEmail({ email: existingToken.email });

    if (!existingUser) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "User account not found",
      });
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

export const updateUserAccountEmail = withProtectedDataAccess({
  schema: UpdateUserAccountEmailSchema,
  callback: async ({ newEmail, verificationToken }, currentUser) => {
    const existingUser = await getUserByEmail({ email: newEmail });

    if (existingUser) {
      return createDataAccessError({
        type: "DUPLICATE_RESOURCE",
        message: "An account with this email already exists",
      });
    }

    if (!currentUser) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "User not found!",
      });
    }

    if (!currentUser.email || currentUser.email === newEmail) {
      return createDataAccessError({
        type: "EMAIL_MUST_BE_DIFFERENT",
        message: "New email must be different from current email",
      });
    }

    if (!verificationToken) {
      const res = await sendEmailVerificationEmail({
        email: newEmail,
      });
      if (isDataAccessError(res)) {
        return res;
      }
      return {
        verifyEmail: true,
      };
    }

    const existingToken = await getVerificationTokenByTokenAndEmail({
      token: verificationToken,
      email: newEmail,
    });

    if (!existingToken) {
      return createDataAccessError({
        type: "INVALID_TOKEN",
        message: "Invalid email verification token",
      });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return createDataAccessError({
        type: "TOKEN_EXPIRED",
        message: "Email verification token has expired",
      });
    }

    await updateUser({
      id: currentUser.id,
      data: {
        email: newEmail,
      },
    });

    return {
      verifyEmail: false,
    };
  },
});

export const updateUserAccountPassword = withProtectedDataAccess({
  schema: UpdateUserAccountPasswordSchema,
  callback: async ({ currentPassword, newPassword }, user) => {
    const currentUser = await getUserById({ id: user.id });

    if (!currentUser?.salt || !currentUser.password) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "User account not found",
      });
    }

    const passwordsMatch = await verifyPassword({
      plainTextPassword: currentPassword,
      salt: currentUser.salt,
      hashedPassword: currentUser.password,
    });

    if (!passwordsMatch) {
      return createDataAccessError({
        type: "INVALID_LOGIN",
        message: "Current password is incorrect",
      });
    }

    await updateUserPassword({
      data: {
        userId: currentUser.id,
        password: newPassword,
      },
    });
  },
});
