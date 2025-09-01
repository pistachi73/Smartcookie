import { useInfiniteQuery } from "@tanstack/react-query";

import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";

export const usePaginatedSessionsByHubId = (hubId: number) => {
  return useInfiniteQuery(getPaginatedSessionsByHubIdQueryOptions(hubId));
};
