import { useQuery } from "@tanstack/react-query";
import { getHubsAction } from "../actions";

export const useHubs = () => {
  return useQuery({
    queryKey: ["hubs"],
    queryFn: async () => {
      const res = await getHubsAction();
      return res?.data;
    },
  });
};
