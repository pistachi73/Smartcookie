import {
  getUserById,
  updateUserPassword,
  verifyPassword,
} from "@/data-access/user";
import { PublicError } from "@/shared/services/errors";

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
