import { queryOptions } from "@tanstack/react-query";

import { getHubById, getHubsByUserId } from "@/data-access/hubs/queries";

export const getHubsByUserIdQueryOptions = queryOptions({
  queryKey: ["hubs"],
  queryFn: getHubsByUserId,
});

export const getHubByIdQueryOptions = (hubId?: number) =>
  queryOptions({
    queryKey: ["hub", hubId],
    queryFn: () => getHubById({ hubId: hubId ?? 0 }),
    enabled: !!hubId,
  });
