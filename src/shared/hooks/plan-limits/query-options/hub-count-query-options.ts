import { queryOptions } from "@tanstack/react-query";

import { getUserHubCount } from "@/data-access/hubs/queries";

export const getUserHubCountQueryOptions = queryOptions({
  queryKey: ["user-hub-count"],
  queryFn: getUserHubCount,
});
