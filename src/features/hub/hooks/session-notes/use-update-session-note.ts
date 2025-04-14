import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { UpdateSessionNoteUseCaseSchema } from "../../lib/session-notes.schema";
import type { SessionNotesMap } from "../../types/session.types";
import { updateSessionNoteUseCase } from "../../use-cases/session-notes.use-case";

type UpdateNoteSessionData = z.infer<typeof UpdateSessionNoteUseCaseSchema>;

type OptimisticContext = {
  sourcePreviousNotes: SessionNotesMap | undefined;
  targetPreviousNotes: SessionNotesMap | undefined;
};

export function useUpdateSessionNote() {
  const queryClient = useQueryClient();

  return useProtectedMutation<
    UpdateNoteSessionData,
    Awaited<ReturnType<typeof updateSessionNoteUseCase>>,
    OptimisticContext
  >({
    schema: UpdateSessionNoteUseCaseSchema,
    mutationFn: updateSessionNoteUseCase,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches for both source and target
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["session-notes", variables.source.sessionId],
        }),
        queryClient.cancelQueries({
          queryKey: ["session-notes", variables.target.sessionId],
        }),
      ]);

      // Snapshot the previous values
      const sourcePreviousNotes = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        variables.source.sessionId,
      ]);

      const targetPreviousNotes = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        variables.target.sessionId,
      ]);

      // Optimistically update both source and target
      if (sourcePreviousNotes) {
        queryClient.setQueryData<SessionNotesMap>(
          ["session-notes", variables.source.sessionId],
          (old) => {
            if (!old) return old;
            const updatedNotes = { ...old };
            // Remove the note from the source position
            updatedNotes[variables.source.position] = old[
              variables.source.position
            ].filter((note) => note.id !== variables.noteId);
            return updatedNotes;
          },
        );
      }

      if (targetPreviousNotes) {
        queryClient.setQueryData<SessionNotesMap>(
          ["session-notes", variables.target.sessionId],
          (old) => {
            if (!old) return old;
            const updatedNotes = { ...old };
            // Find the note in the source notes
            const noteToMove = sourcePreviousNotes?.[
              variables.source.position
            ].find((note) => note.id === variables.noteId);
            if (noteToMove) {
              // Add the note to the target position with updated values
              updatedNotes[variables.target.position] = [
                ...(old[variables.target.position] || []),
                {
                  ...noteToMove,
                  sessionId: variables.target.sessionId,
                  position: variables.target.position,
                },
              ];
            }
            return updatedNotes;
          },
        );
      }

      return { sourcePreviousNotes, targetPreviousNotes };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back both source and target
      if (context?.sourcePreviousNotes) {
        queryClient.setQueryData(
          ["session-notes", variables.source.sessionId],
          context.sourcePreviousNotes,
        );
      }
      if (context?.targetPreviousNotes) {
        queryClient.setQueryData(
          ["session-notes", variables.target.sessionId],
          context.targetPreviousNotes,
        );
      }
      toast.error("Failed to update note");
      console.error(error);
    },
  });
}
