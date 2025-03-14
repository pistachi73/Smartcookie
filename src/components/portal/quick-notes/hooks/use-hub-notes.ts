import { getHubNotesAction } from "@/app/(portal)/quick-notes/actions";
import { useQuery } from "@tanstack/react-query";

export const useHubNotes = (hubId: number) => {
  return useQuery({
    queryKey: ["hub-notes", hubId],
    queryFn: async () => {
      const res = await getHubNotesAction({ hubId });
      return res?.data;
    },
  });
};
