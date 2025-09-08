import { type QueryKey, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { addSessionNote } from "@/data-access/session-notes/mutations";
import { CreateSessionNoteSchema } from "@/data-access/session-notes/schemas";
import { getSessionNotesBySessionIdQueryOptions } from "../../lib/session-notes-query-options";
import type {
  ClientSessionNote,
  ClientSessionNotesMap,
} from "../../types/session-notes.types";

interface MutationContext {
  previousData: ClientSessionNotesMap | undefined;
  optimisticId: number;
  clientId: string;
  sessionNotesQueryKey: QueryKey;
}

export function useAddSessionNote() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: CreateSessionNoteSchema,
    mutationFn: addSessionNote,
    onMutate: async (input): Promise<MutationContext> => {
      const queryKey = getSessionNotesBySessionIdQueryOptions(
        input.sessionId,
      ).queryKey;
      await queryClient.cancelQueries({
        queryKey,
      });
      const previousData =
        queryClient.getQueryData<ClientSessionNotesMap>(queryKey);

      const optimisticId = -Date.now();
      const clientId = `client-${Date.now()}`;

      const optimisticNote: ClientSessionNote = {
        id: optimisticId,
        sessionId: input.sessionId,
        content: input.content,
        position: input.position,
        clientId,
      };

      queryClient.setQueryData<ClientSessionNotesMap>(
        ["session-notes", input.sessionId],
        (old) => {
          if (!old) {
            return {
              plans: [],
              "in-class": [],
            };
          }
          return {
            ...old,
            [input.position]: [optimisticNote, ...(old[input.position] ?? [])],
          };
        },
      );

      return {
        previousData,
        optimisticId,
        clientId,
        sessionNotesQueryKey: queryKey,
      };
    },

    onSuccess: (data, input, context) => {
      if (!data || !context) return;

      queryClient.setQueryData<ClientSessionNotesMap>(
        context.sessionNotesQueryKey,
        (old) => {
          if (!old) {
            return {
              plans: [],
              "in-class": [],
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

    onError: (error, _, context) => {
      toast.error("Failed to add note");
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
