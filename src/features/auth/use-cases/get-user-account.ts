import { getAccountByUserId } from "@/data-access/account";
import { getUserByEmail } from "@/data-access/user";

export const getUserAndAccountByEmailUseCase = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) return { user: null, account: null };

  const account = await getAccountByUserId(user.id);

  return { user, account };
};
