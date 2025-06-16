import { useQuery } from "@tanstack/react-query";
import { getHubByIdQueryOptions } from "../lib/hub-query-options";

export const useHubById = (hubId: number) => {
  return useQuery(getHubByIdQueryOptions(hubId));
};
