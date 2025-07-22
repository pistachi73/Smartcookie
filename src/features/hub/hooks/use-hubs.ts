import { useQuery } from "@tanstack/react-query";

import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";

export const useHubs = () => {
  return useQuery(getHubsByUserIdQueryOptions);
};
