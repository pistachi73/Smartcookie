import { auth } from "@/core/config/auth-config";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};
