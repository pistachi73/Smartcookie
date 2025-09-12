import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { updateSessionNote } from "@/data-access/session-notes/mutations";
import { getSessionNotesBySessionIdQueryOptions } from "../../lib/session-notes-query-options";
import type { ClientSessionNotesMap } from "../../types/session-notes.types";

export function useUpdateSessionNotePosition() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: z.object({
      noteId: z.number(),
      source: z.object({
        sessionId: z.number(),
        position: z.enum(["plans", "in-class"]),
      }),
      target: z.object({
        sessionId: z.number(),
        position: z.enum(["plans", "in-class"]),
      }),
    }),
    mutationFn: (data) => {
      return updateSessionNote({
        noteId: data.noteId,
        sessionId: data.target.sessionId,
        position: data.target.position,
      });
    },

    onMutate: async (variables) => {
      const sourceQueryKey = getSessionNotesBySessionIdQueryOptions(
        variables.source.sessionId,
      ).queryKey;
      const targetQueryKey = getSessionNotesBySessionIdQueryOptions(
        variables.target.sessionId,
      ).queryKey;

      // Cancel any outgoing refetches for both source and target
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: sourceQueryKey,
        }),
        queryClient.cancelQueries({
          queryKey: targetQueryKey,
        }),
      ]);

      // Snapshot the previous values
      const sourcePreviousNotes = queryClient.getQueryData(sourceQueryKey);
      const targetPreviousNotes = queryClient.getQueryData(targetQueryKey);

      console.log({ sourcePreviousNotes, targetPreviousNotes });

      // Optimistically update both source and target
      if (sourcePreviousNotes) {
        queryClient.setQueryData(sourceQueryKey, (old) => {
          if (!old) return old;
          const updatedNotes = { ...old };

          console.log({ updatedNotes });
          // Remove the note from the source position
          updatedNotes[variables.source.position] = old[
            variables.source.position
          ].filter((note) => note.id !== variables.noteId);
          return updatedNotes;
        });
      }

      if (targetPreviousNotes) {
        queryClient.setQueryData<ClientSessionNotesMap>(
          targetQueryKey,
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

      return {
        sourcePreviousNotes,
        targetPreviousNotes,
        sourceSessionNotesQueryKey: sourceQueryKey,
        targetSessionNotesQueryKey: targetQueryKey,
      };
    },
    onError: (error, _, context) => {
      // If the mutation fails, roll back both source and target
      if (context?.sourcePreviousNotes) {
        queryClient.setQueryData(
          context.sourceSessionNotesQueryKey,
          context.sourcePreviousNotes,
        );
      }
      if (context?.targetPreviousNotes) {
        queryClient.setQueryData(
          context.targetSessionNotesQueryKey,
          context.targetPreviousNotes,
        );
      }
      toast.error("Failed to update note");
      console.error(error);
    },
  });
}
