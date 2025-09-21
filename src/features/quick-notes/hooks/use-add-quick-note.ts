import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getUserQuickNoteCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/notes-count-query-options";
import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createQuickNote } from "@/data-access/quick-notes/mutations";
import { CreateQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";
import type { NoteSummary } from "../types/quick-notes.types";

export const useAddQuickNote = () => {
  const queryClient = useQueryClient();
  const limitToaster = useLimitToaster();

  return useProtectedMutation({
    schema: CreateQuickNoteSchema,
    mutationFn: createQuickNote,
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches for the specific hub
      const hubId = newNote.hubId;
      const hubNotesQueryKey = quickNotesByHubIdQueryOptions(hubId).queryKey;
      const userQucikNotesQueryKey = getUserQuickNoteCountQueryOptions.queryKey;

      await queryClient.cancelQueries({ queryKey: hubNotesQueryKey });

      const previousData = queryClient.getQueryData(hubNotesQueryKey);
      const previousUserQuickNotesCount = queryClient.getQueryData(
        userQucikNotesQueryKey,
      );

      const optimisticId = -Date.now();
      const clientId = `client-${Date.now()}`;

      const optimisticNote: NoteSummary = {
        id: optimisticId,
        content: newNote.content,
        hubId: newNote.hubId,
        status: "active",
        clientId,
      };

      queryClient.setQueryData(hubNotesQueryKey, (old) => {
        if (!old) return [optimisticNote];
        return [optimisticNote, ...old];
      });

      queryClient.setQueryData(userQucikNotesQueryKey, (old) => {
        if (!old) return 1;
        return old + 1;
      });

      return {
        previousData,
        previousUserQuickNotesCount,
        optimisticId,
        clientId,
        hubId,
        hubNotesQueryKey,
        userQucikNotesQueryKey,
      };
    },

    onSuccess: (res, _, context) => {
      if (isDataAccessError(res)) {
        queryClient.setQueryData(
          context.hubNotesQueryKey,
          context.previousData,
        );

        queryClient.setQueryData(
          context.userQucikNotesQueryKey,
          context.previousUserQuickNotesCount,
        );

        switch (res.type) {
          case "LIMIT_REACHED_NOTES":
          case "CONTENT_LIMIT_REACHED_QUICK_NOTES":
            limitToaster({
              title: res.message,
            });
            break;
          default:
            toast.error(res.message);
            break;
        }
        return;
      }

      const { optimisticId, clientId, hubNotesQueryKey } = context;
      const newNote = res;

      queryClient.setQueryData(hubNotesQueryKey, (old) => {
        if (!old) return old;
        return old.map((note) => {
          if (note.id === optimisticId) {
            return {
              ...newNote,
              clientId,
            };
          }
          return note;
        });
      });
    },
  });
};
