import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { addSessionNote } from "@/data-access/session-notes/mutations";
import { CreateSessionNoteSchema } from "@/data-access/session-notes/schemas";
import {
  getSessionNotesBySessionIdQueryOptions,
  type SessionNotesWithClientId,
} from "../../lib/session-notes-query-options";

export function useAddSessionNote() {
  const queryClient = useQueryClient();
  const limitToaster = useLimitToaster();

  return useProtectedMutation({
    schema: CreateSessionNoteSchema,
    mutationFn: addSessionNote,
    onMutate: async (input) => {
      const queryKey = getSessionNotesBySessionIdQueryOptions(
        input.sessionId,
      ).queryKey;
      await queryClient.cancelQueries({
        queryKey,
      });
      const previousData = queryClient.getQueryData(queryKey);

      const optimisticId = -Date.now();
      const clientId = `client-${Date.now()}`;

      const optimisticNote: SessionNotesWithClientId = {
        id: optimisticId,
        sessionId: input.sessionId,
        content: input.content,
        position: input.position,
        clientId,
      };

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return undefined;

        return {
          ...old,
          [input.position]: [optimisticNote, ...(old[input.position] ?? [])],
        };
      });

      return {
        previousData,
        optimisticId,
        clientId,
        sessionNotesQueryKey: queryKey,
      };
    },

    onSuccess: (data, input, context) => {
      if (isDataAccessError(data)) {
        queryClient.setQueryData(
          context.sessionNotesQueryKey,
          context.previousData,
        );
        switch (data.type) {
          case "CONTENT_LIMIT_REACHED_SESSION_NOTES":
            limitToaster({
              title: data.message,
            });
            break;
          default:
            toast.error(data.message);
            break;
        }
        return;
      }

      queryClient.setQueryData(context.sessionNotesQueryKey, (old) => {
        if (!old) return undefined;
        return {
          ...old,
          [input.position]: old[input.position].map((note) =>
            note.id === context.optimisticId
              ? { ...data, clientId: context.clientId }
              : note,
          ),
        };
      });
    },
  });
}
