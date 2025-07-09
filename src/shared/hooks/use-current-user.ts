import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useCurrentUser = () => {
  const session = useSession();
  const user = useMemo(() => session.data?.user, [session]);
  return user || null;
};
