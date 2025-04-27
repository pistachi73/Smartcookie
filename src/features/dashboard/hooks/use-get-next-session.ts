import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getNextSessionUseCase } from "../use-cases/dashboard.use-case";

export const getNextSessionQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["next-session", userId],
    queryFn: () => getNextSessionUseCase(),
  });
};

export const useGetNextSession = () => {
  const user = useCurrentUser();

  return useQuery(getNextSessionQueryOptions(user.id));
};
