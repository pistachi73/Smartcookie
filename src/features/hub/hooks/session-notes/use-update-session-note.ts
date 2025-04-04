import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { UpdateSessionNoteInputSchema } from "../../lib/schemas";
import type { SessionNotesMap } from "../../types/session.types";
import { updateSessionNoteUseCase } from "../../use-cases/session-notes/update-session-note.use-case";

type UpdateNoteSessionData = z.infer<typeof UpdateSessionNoteInputSchema>;

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
    schema: UpdateSessionNoteInputSchema,
    mutationFn: updateSessionNoteUseCase,
    onMutate: async (variables) => {
      const request = variables as UpdateNoteSessionData;

      // Cancel any outgoing refetches for both source and target
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["session-notes", request.source.sessionId],
        }),
        queryClient.cancelQueries({
          queryKey: ["session-notes", request.target.sessionId],
        }),
      ]);

      // Snapshot the previous values
      const sourcePreviousNotes = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        request.source.sessionId,
      ]);

      const targetPreviousNotes = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        request.target.sessionId,
      ]);

      // Optimistically update both source and target
      if (sourcePreviousNotes) {
        queryClient.setQueryData<SessionNotesMap>(
          ["session-notes", request.source.sessionId],
          (old) => {
            if (!old) return old;
            const updatedNotes = { ...old };
            // Remove the note from the source position
            updatedNotes[request.source.position] = old[
              request.source.position
            ].filter((note) => note.id !== request.noteId);
            return updatedNotes;
          },
        );
      }

      if (targetPreviousNotes) {
        queryClient.setQueryData<SessionNotesMap>(
          ["session-notes", request.target.sessionId],
          (old) => {
            if (!old) return old;
            const updatedNotes = { ...old };
            // Find the note in the source notes
            const noteToMove = sourcePreviousNotes?.[
              request.source.position
            ].find((note) => note.id === request.noteId);
            if (noteToMove) {
              // Add the note to the target position with updated values
              updatedNotes[request.target.position] = [
                ...(old[request.target.position] || []),
                {
                  ...noteToMove,
                  sessionId: request.target.sessionId,
                  position: request.target.position,
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
