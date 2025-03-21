import { getHubNotesAction, getHubsAction } from "@/features/notes/actions";
import { queryOptions } from "@tanstack/react-query";

export const quickNotesHubsQueryOptions = queryOptions({
  queryKey: ["quick-notes-hubs"],
  queryFn: async () => {
    const data = await getHubsAction();
    return data?.data;
  },
});

export const getHubNotesQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-notes", hubId],
    queryFn: async () => {
      const data = await getHubNotesAction({ hubId });
      return data?.data;
    },
  });
