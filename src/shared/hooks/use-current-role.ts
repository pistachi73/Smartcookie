import { useCurrentUser } from "./use-current-user";

export const useCurrentRole = () => {
  const user = useCurrentUser();

  return user?.role || null;
};
