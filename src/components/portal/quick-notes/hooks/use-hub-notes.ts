import { useQuery } from "@tanstack/react-query";
import { getHubNotesQueryOptions } from "../utils";

export const useHubNotes = (hubId: number) => {
  return useQuery(getHubNotesQueryOptions(hubId));
};
