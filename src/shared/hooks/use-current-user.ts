import type { ExtendedUser } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useCurrentUser = () => {
  const session = useSession();
  const user = useMemo(() => session.data?.user as ExtendedUser, [session]);
  return user || null;
};
