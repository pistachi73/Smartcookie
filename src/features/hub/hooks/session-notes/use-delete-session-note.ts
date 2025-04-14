import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { DeleteSessionNoteUseCaseSchema } from "../../lib/session-notes.schema";
import type { SessionNotesMap } from "../../types/session.types";
import { deleteSessionNoteUseCase } from "../../use-cases/session-notes.use-case";

interface MutationContext {
  previousData: SessionNotesMap | undefined;
  sessionId: number;
}

export function useDeleteSessionNote() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteSessionNoteUseCaseSchema,
    mutationFn: deleteSessionNoteUseCase,
    onMutate: async (input): Promise<MutationContext> => {
      await queryClient.cancelQueries({
        queryKey: ["session-notes", input.sessionId],
      });

      const previousData = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        input.sessionId,
      ]);

      queryClient.setQueryData<SessionNotesMap>(
        ["session-notes", input.sessionId],
        (old) => {
          if (!old) return { past: [], present: [], future: [] };

          return {
            past: old.past?.filter((note) => note.id !== input.noteId) ?? [],
            present:
              old.present?.filter((note) => note.id !== input.noteId) ?? [],
            future:
              old.future?.filter((note) => note.id !== input.noteId) ?? [],
          };
        },
      );

      return { previousData, sessionId: input.sessionId };
    },

    onError: (error, _, context) => {
      toast.error("Failed to delete note");
      if (context?.previousData) {
        queryClient.setQueryData(
          ["session-notes", context.sessionId],
          context.previousData,
        );
      }
      console.error(error);
    },
  });
}
