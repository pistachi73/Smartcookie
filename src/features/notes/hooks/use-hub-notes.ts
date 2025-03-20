import { useQuery } from "@tanstack/react-query";
import { getHubNotesQueryOptions } from "../lib/quick-notes-query-options";

export const useHubNotes = (hubId: number) => {
  return useQuery(getHubNotesQueryOptions(hubId));
};
