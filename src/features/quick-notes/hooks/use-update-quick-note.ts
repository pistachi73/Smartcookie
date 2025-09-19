import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useNotesLimits } from "@/shared/hooks/plan-limits/use-notes-limits";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { updateQuickNote } from "@/data-access/quick-notes/mutations";
import { UpdateQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";

export interface UseUpdateQuickNoteProps {
  noteId: number;
  initialContent: string;
  hubId: number;
  clientId?: string;
}

interface PendingSave {
  content: string;
  updatedAt: string;
  originalNoteId: number;
  clientId?: string;
}

export const useUpdateQuickNote = ({
  noteId,
  initialContent,
  hubId,
  clientId,
}: UseUpdateQuickNoteProps) => {
  const [content, setContent] = useState(initialContent);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<PendingSave | null>(null);
  const queryClient = useQueryClient();
  const limitToaster = useLimitToaster();

  const { maxCharacters } = useNotesLimits();

  const updateQuickNoteSchema = UpdateQuickNoteSchema({
    maxLength: maxCharacters,
  });

  const { mutate, isPending: isSaving } = useProtectedMutation({
    schema: updateQuickNoteSchema,
    mutationFn: updateQuickNote,
    onMutate: async (variables) => {
      setIsUnsaved(true);
      const hubNotesQueryKey = quickNotesByHubIdQueryOptions(hubId).queryKey;
      await queryClient.cancelQueries({ queryKey: hubNotesQueryKey });

      const previousData = queryClient.getQueryData(hubNotesQueryKey);

      queryClient.setQueryData(hubNotesQueryKey, (old) => {
        if (!old) return old;

        return old.map((note) => {
          if (note.id === noteId) {
            return {
              ...note,
              content: variables.content,
            };
          }
          return note;
        });
      });

      return { previousData, hubNotesQueryKey };
    },

    onSuccess: (response, _, context) => {
      if (isDataAccessError(response)) {
        queryClient.setQueryData(
          context.hubNotesQueryKey,
          context.previousData,
        );
        switch (response.type) {
          case "CONTENT_LIMIT_REACHED_QUICK_NOTES":
            limitToaster({
              title: response.message,
            });
            return;
          default:
            toast.error(response.message);
            return;
        }
      }

      setIsUnsaved(false);
      pendingSaveRef.current = null;
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    },
  });

  const checkForRealNoteIdAndSave = () => {
    const hubNotesQueryKey = quickNotesByHubIdQueryOptions(hubId).queryKey;
    const hubNotes = queryClient.getQueryData(hubNotesQueryKey);

    if (!hubNotes || !pendingSaveRef.current) return;

    const pendingSave = pendingSaveRef.current;

    const realNote = hubNotes.find((note) => {
      if (note.id <= 0) return false; // Skip other optimistic notes

      if (pendingSave.clientId && note.clientId === pendingSave.clientId) {
        return true;
      }

      return false;
    });

    if (!realNote) return;

    pendingSaveRef.current = null;

    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    mutate({
      id: realNote.id,
      content: pendingSave.content,
      updatedAt: pendingSave.updatedAt,
    });
  };

  const startRetryPolling = (pendingSave: PendingSave) => {
    pendingSaveRef.current = pendingSave;

    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
    }

    retryIntervalRef.current = setInterval(checkForRealNoteIdAndSave, 500);

    setTimeout(() => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
        pendingSaveRef.current = null;
        toast.error(
          "Note creation timed out. Please try editing the note again.",
        );
      }
    }, 10000);
  };

  const debouncedSave = (newContent: string, newUpdatedAt: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (noteId < 0) {
        startRetryPolling({
          content: newContent,
          originalNoteId: noteId,
          updatedAt: newUpdatedAt,
          clientId,
        });

        return;
      }

      if (newContent !== initialContent) {
        mutate({
          id: noteId,
          content: newContent,
          updatedAt: newUpdatedAt,
        });
      }
    }, 800);
  };

  const handleContentChange = (newContent: string) => {
    const newTimestamp = new Date().toISOString();
    setIsUnsaved(true);
    setContent(newContent);
    debouncedSave(newContent, newTimestamp);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, []);

  return {
    content,
    isUnsaved,
    isSaving,
    handleContentChange,
  };
};
