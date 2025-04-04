import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { AddSessionNoteUseCaseSchema } from "../../lib/schemas";
import type { SessionNote, SessionNotesMap } from "../../types/session.types";
import { addSessionNoteUseCase } from "../../use-cases/session-notes/add-session-note.use-case";

interface MutationContext {
  previousData: SessionNotesMap | undefined;
  optimisticId: number;
  clientId: string;
}

export function useAddSessionNote() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: AddSessionNoteUseCaseSchema,
    mutationFn: addSessionNoteUseCase,
    onMutate: async (input): Promise<MutationContext> => {
      await queryClient.cancelQueries({
        queryKey: ["session-notes", input.sessionId],
      });
      const previousData = queryClient.getQueryData<SessionNotesMap>([
        "session-notes",
        input.sessionId,
      ]);

      const optimisticId = -Date.now();
      const clientId = `client-${Date.now()}`;

      const optimisticNote: SessionNote = {
        id: optimisticId,
        sessionId: input.sessionId,
        content: input.content,
        position: input.position,
        clientId,
      };

      queryClient.setQueryData<SessionNotesMap>(
        ["session-notes", input.sessionId],
        (old) => {
          if (!old) {
            return {
              past: [],
              present: [],
              future: [],
            };
          }
          return {
            ...old,
            [input.position]: [optimisticNote, ...(old[input.position] ?? [])],
          };
        },
      );

      return { previousData, optimisticId, clientId };
    },

    onSuccess: (data, input, context) => {
      if (!data || !context) return;

      queryClient.setQueryData<SessionNotesMap>(
        ["session-notes", input.sessionId],
        (old) => {
          if (!old) {
            return {
              past: [],
              present: [],
              future: [],
            };
          }
          return {
            ...old,
            [input.position]: old[input.position].map((note) =>
              note.id === context.optimisticId
                ? { ...data, clientId: context.clientId }
                : note,
            ),
          };
        },
      );
    },

    onError: (error, input, context) => {
      toast.error("Failed to add note");
      if (context?.previousData) {
        queryClient.setQueryData(
          ["session-notes", input.sessionId],
          context.previousData,
        );
      }
      console.error(error);
    },
  });
}
