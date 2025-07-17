import { type QueryKey, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSessionNote } from "@/data-access/session-notes/mutations";
import { DeleteSessionNoteSchema } from "@/data-access/session-notes/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { getSessionNotesBySessionIdQueryOptions } from "../../lib/session-notes-query-options";
import type { ClientSessionNotesMap } from "../../types/session-notes.types";

interface MutationContext {
  previousData: ClientSessionNotesMap | undefined;
  sessionId: number;
  sessionNotesQueryKey: QueryKey;
}

export function useDeleteSessionNote() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteSessionNoteSchema,
    mutationFn: deleteSessionNote,
    onMutate: async (input): Promise<MutationContext> => {
      const queryKey = getSessionNotesBySessionIdQueryOptions(
        input.sessionId,
      ).queryKey;
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousData =
        queryClient.getQueryData<ClientSessionNotesMap>(queryKey);

      queryClient.setQueryData<ClientSessionNotesMap>(queryKey, (old) => {
        if (!old) return { plans: [], "in-class": [] };

        return {
          plans: old.plans?.filter((note) => note.id !== input.noteId) ?? [],
          "in-class":
            old["in-class"]?.filter((note) => note.id !== input.noteId) ?? [],
        };
      });

      return {
        previousData,
        sessionId: input.sessionId,
        sessionNotesQueryKey: queryKey,
      };
    },

    onError: (error, _, context) => {
      toast.error("Failed to delete note");
      if (context?.previousData) {
        queryClient.setQueryData(
          context.sessionNotesQueryKey,
          context.previousData,
        );
      }
      console.error(error);
    },
  });
}
