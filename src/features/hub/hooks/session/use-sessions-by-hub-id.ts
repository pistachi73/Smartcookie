import { useQuery } from "@tanstack/react-query";

import { getSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";

export const useSessionsByHubId = (hubId: number) => {
  return useQuery(getSessionsByHubIdQueryOptions(hubId));
};
