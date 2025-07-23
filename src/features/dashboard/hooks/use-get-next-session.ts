import { queryOptions, useQuery } from "@tanstack/react-query";

import { getNextSessionUseCase } from "../use-cases/dashboard.use-case";

export const getNextSessionQueryOptions = () => {
  return queryOptions({
    queryKey: ["next-session"],
    queryFn: () => getNextSessionUseCase(),
  });
};

export const useGetNextSession = () => {
  return useQuery(getNextSessionQueryOptions());
};
