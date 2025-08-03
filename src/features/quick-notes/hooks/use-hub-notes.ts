import { useQuery } from "@tanstack/react-query";

import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";

export const useHubNotes = (hubId: number) => {
  return useQuery(quickNotesByHubIdQueryOptions(hubId));
};
