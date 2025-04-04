import { queryOptions, useQuery } from "@tanstack/react-query";
import { getHubByIdUseCase } from "../use-cases/get-hub-by-id.use-case";

export const getHubByIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub", hubId],
    queryFn: () => getHubByIdUseCase({ hubId }),
  });

export const useHubById = (hubId: number) => {
  return useQuery({
    ...getHubByIdQueryOptions(hubId),
  });
};
