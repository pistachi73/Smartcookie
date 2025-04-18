import { useQuery } from "@tanstack/react-query";
import { getHubsAction } from "../actions";

export const getHubsQueryOptions = {
  queryKey: ["hubs"],
  queryFn: async () => {
    const res = await getHubsAction();
    console.log({ res: res?.data });
    return res?.data;
  },
};

export const useHubs = () => {
  return useQuery(getHubsQueryOptions);
};
