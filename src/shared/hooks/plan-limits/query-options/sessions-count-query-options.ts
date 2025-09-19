import { queryOptions } from "@tanstack/react-query";

import { getSessionsCountByHubId } from "@/data-access/sessions/queries";

export const getSessionsCountByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-sessions-count", hubId],
    queryFn: () => getSessionsCountByHubId({ hubId }),
  });
