import { cache } from "react";
import { auth } from "@/core/config/auth-config";

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const currentRole = cache(async () => {
  const session = await auth();
  return session?.user.role;
});
