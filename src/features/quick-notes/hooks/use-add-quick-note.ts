import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { createQuickNote } from "@/data-access/quick-notes/mutations";
import { CreateQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";
import type { NoteSummary } from "../types/quick-notes.types";

export const useAddQuickNote = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: CreateQuickNoteSchema,
    mutationFn: createQuickNote,
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches for the specific hub
      const hubId = newNote.hubId;
      const hubNotesQueryKey = quickNotesByHubIdQueryOptions(hubId).queryKey;
      await queryClient.cancelQueries({ queryKey: hubNotesQueryKey });

      const previousData = queryClient.getQueryData(hubNotesQueryKey);

      const optimisticId = -Date.now(); // Use negative number to avoid collisions
      const clientId = `client-${Date.now()}`; // Stable ID for animations

      const optimisticNote: NoteSummary = {
        id: optimisticId,
        content: newNote.content,
        updatedAt: newNote.updatedAt,
        hubId: newNote.hubId,
        clientId, // Add clientId for animation stability
      };

      queryClient.setQueryData(hubNotesQueryKey, (old) => {
        if (!old) return [optimisticNote];
        return [optimisticNote, ...old];
      });

      return { previousData, optimisticId, clientId, hubId, hubNotesQueryKey };
    },
    onError: (_, __, context) => {
      if (context?.hubNotesQueryKey !== undefined) {
        queryClient.setQueryData(
          context.hubNotesQueryKey,
          context.previousData,
        );
      }
      toast.error("Failed to add note");
    },
    onSuccess: (response, _, context) => {
      if (!response || !context) return;

      const { optimisticId, clientId, hubNotesQueryKey } = context;
      const newNote = response;

      queryClient.setQueryData(hubNotesQueryKey, (old) => {
        if (!old) return old;

        return old.map((note) => {
          if (note.id === optimisticId) {
            // Return the server note but keep the clientId for animation stability
            return {
              ...newNote,
              clientId, // Keep the clientId for animation stability
            };
          }
          return note;
        });
      });
    },
  });
};
