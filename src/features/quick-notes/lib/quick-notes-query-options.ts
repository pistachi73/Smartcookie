import { queryOptions } from "@tanstack/react-query";

import { getHubsByUserIdForQuickNotes } from "@/data-access/hubs/queries";
import { getNotesByHubId } from "@/data-access/quick-notes/queries";

export const quickNotesHubsQueryOptions = queryOptions({
  queryKey: ["quick-notes-hubs"],
  queryFn: getHubsByUserIdForQuickNotes,
});

export const quickNotesByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-notes", hubId],
    queryFn: () => getNotesByHubId({ hubId }),
  });
