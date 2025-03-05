import { getHubsWithNotesAction } from "@/app/(portal)/quick-notes/actions";
import { queryOptions } from "@tanstack/react-query";

export const quickNotesQueryOptions = queryOptions({
  queryKey: ["quick-notes-data"],
  queryFn: async () => {
    const data = await getHubsWithNotesAction();
    return data?.data;
  },
});
