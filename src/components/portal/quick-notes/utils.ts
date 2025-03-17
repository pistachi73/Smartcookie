import {
  getHubNotesAction,
  getHubsAction,
  getHubsWithNotesAction,
} from "@/app/(portal)/quick-notes/actions";
import { queryOptions } from "@tanstack/react-query";

export const quickNotesQueryOptions = queryOptions({
  queryKey: ["quick-notes-data"],
  queryFn: async () => {
    const data = await getHubsWithNotesAction();
    return data?.data;
  },
});

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
      console.log("getHubNotesQueryOptions", data);
      return data?.data;
    },
  });
