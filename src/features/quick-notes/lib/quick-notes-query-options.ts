import type { getHubsByUserIdForQuickNotes } from "@/data-access/hubs/queries";
import type { getNotesByHubId } from "@/data-access/quick-notes/queries";
import type {
  HubSummary,
  NoteSummary,
} from "@/features/quick-notes/types/quick-notes.types";
import { queryOptions } from "@tanstack/react-query";

export const quickNotesHubsQueryOptions = queryOptions({
  queryKey: ["quick-notes-hubs"],
  queryFn: async () => {
    const response = await fetch("/api/hubs/quick-notes");
    const json = (await response.json()) as Awaited<
      ReturnType<typeof getHubsByUserIdForQuickNotes>
    >;
    return [
      { id: 0, name: "General Notes", color: "neutral" },
      ...json,
    ] as HubSummary[];
  },
});

export const quickNotesByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-notes", hubId],
    queryFn: async (): Promise<NoteSummary[]> => {
      const response = await fetch(`/api/hubs/${hubId}/notes`);
      const json = (await response.json()) as Awaited<
        ReturnType<typeof getNotesByHubId>
      >;

      return json;
    },
  });
