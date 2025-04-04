import { auth } from "@/core/config/auth-config";
import { cache } from "react";

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const currentRole = cache(async () => {
  const session = await auth();
  return session?.user.role;
});
