import { generatePasswordResetToken } from "@/data-access/password-reset-token";
import { getUserByEmail } from "@/data-access/user";
import { sendPasswordResetEmail } from "@/shared/lib/mail";
import { PublicError } from "@/shared/services/errors";

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
