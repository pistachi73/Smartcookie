import { useSuspenseQuery } from "@tanstack/react-query";
import { getHubsAction } from "../actions";

export const getHubsQueryOptions = {
  queryKey: ["hubs"],
  queryFn: async () => {
    const res = await getHubsAction();
    return res?.data;
  },
};

export const useHubs = () => {
  return useSuspenseQuery(getHubsQueryOptions);
};
