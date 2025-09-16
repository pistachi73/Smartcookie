"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getUserQuickNoteCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/notes-count-query-options";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { deleteQuickNote } from "@/data-access/quick-notes/mutations";
import { DeleteQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";

export const useDeleteQuickNote = ({ hubId }: { hubId: number }) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteQuickNoteSchema,
    mutationFn: deleteQuickNote,
    onMutate: async ({ id }) => {
      const qucikNotesQueryKey = quickNotesByHubIdQueryOptions(hubId).queryKey;
      const quickNotesCountQueryKey =
        getUserQuickNoteCountQueryOptions.queryKey;

      await queryClient.cancelQueries({ queryKey: qucikNotesQueryKey });

      const previousData = queryClient.getQueryData(qucikNotesQueryKey);
      const previousQuickNotesCount = queryClient.getQueryData(
        quickNotesCountQueryKey,
      );

      queryClient.setQueryData(qucikNotesQueryKey, (old) => {
        if (!old) return old;
        return old.filter((note) => note.id !== id);
      });

      queryClient.setQueryData(quickNotesCountQueryKey, (old) => {
        if (!old) return 1;
        return old - 1;
      });

      return {
        previousData,
        previousQuickNotesCount,
        qucikNotesQueryKey,
        quickNotesCountQueryKey,
      };
    },
    onSuccess: (res, _, context) => {
      if (isDataAccessError(res)) {
        queryClient.setQueryData(
          context.qucikNotesQueryKey,
          context.previousData,
        );
        queryClient.setQueryData(
          context.quickNotesCountQueryKey,
          context.previousQuickNotesCount,
        );
        toast.error(res.message);
      }
    },
  });
};
