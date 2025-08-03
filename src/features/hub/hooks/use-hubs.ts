import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";

export const useHubs = () => {
  const queryClient = useQueryClient();
  return useQuery({
    ...getHubsByUserIdQueryOptions(queryClient),
  });
};
