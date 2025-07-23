import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { updateQuickNote } from "@/data-access/quick-notes/mutations";
import { UpdateQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import type { NoteSummary } from "@/features/quick-notes/types/quick-notes.types";

export interface UseUpdateQuickNoteProps {
  noteId: number;
  initialContent: string;
  hubId: number;
  clientId?: string; // Add clientId to props for better matching
}

interface MutationContext {
  previousData: NoteSummary[] | undefined;
}

interface PendingSave {
  content: string;
  updatedAt: string;
  originalNoteId: number; // Track the original optimistic ID
  clientId?: string; // Track the clientId for better matching
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

  const { mutate, isPending: isSaving } = useProtectedMutation({
    schema: UpdateQuickNoteSchema,
    mutationKey: ["updateQuickNote", noteId],
    mutationFn: updateQuickNote,
    onMutate: async (variables): Promise<MutationContext> => {
      setIsUnsaved(true);

      // Cancel any outgoing refetches for this hub
      await queryClient.cancelQueries({ queryKey: ["hub-notes", hubId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<NoteSummary[]>([
        "hub-notes",
        hubId,
      ]);

      queryClient.setQueryData<NoteSummary[]>(["hub-notes", hubId], (old) => {
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

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Revert the optimistic update
      if (context?.previousData) {
        queryClient.setQueryData<NoteSummary[]>(
          ["hub-notes", hubId],
          context.previousData,
        );
      }

      toast.error(
        "Failed to save note. Changes will be lost if you navigate away.",
      );
    },
    onSuccess: (response) => {
      const updatedAt = response?.updatedAt;
      setIsUnsaved(false);
      pendingSaveRef.current = null;

      // Clear any retry intervals since save was successful
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }

      // Update the cache with the server response
      queryClient.setQueryData<NoteSummary[]>(["hub-notes", hubId], (old) => {
        if (!old) return old;

        return old.map((note) => {
          if (note.id === noteId) {
            return {
              ...note,
              updatedAt: updatedAt || note.updatedAt,
            };
          }
          return note;
        });
      });
    },
  });

  const checkForRealNoteId = () => {
    const hubNotes = queryClient.getQueryData<NoteSummary[]>([
      "hub-notes",
      hubId,
    ]);

    if (!hubNotes || !pendingSaveRef.current) return;

    const pendingSave = pendingSaveRef.current;

    // Find the real note using clientId (most reliable) or content as fallback
    const realNote = hubNotes.find((note) => {
      if (note.id <= 0) return false; // Skip other optimistic notes

      // Primary match: clientId (most reliable for newly created notes)
      if (pendingSave.clientId && note.clientId === pendingSave.clientId) {
        return true;
      }

      // Fallback match: content (less reliable but better than nothing)
      if (!pendingSave.clientId && note.content === pendingSave.content) {
        return true;
      }

      return false;
    });

    if (realNote) {
      // Found the real note, trigger the save with the real ID
      pendingSaveRef.current = null;

      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }

      // Update our noteId and trigger the mutation
      mutate({
        id: realNote.id,
        content: pendingSave.content,
        updatedAt: pendingSave.updatedAt,
      });
    }
  };

  const startRetryPolling = (pendingSave: PendingSave) => {
    pendingSaveRef.current = pendingSave;

    // Clear any existing retry interval
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
    }

    // Poll every 500ms to check if the note got a real ID
    retryIntervalRef.current = setInterval(checkForRealNoteId, 500);

    // Stop polling after 10 seconds to prevent infinite polling
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
        // Note is still optimistic, start retry polling
        startRetryPolling({
          content: newContent,
          updatedAt: newUpdatedAt,
          originalNoteId: noteId,
          clientId: clientId, // Use the clientId for reliable matching
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
    setIsUnsaved(true);
    setContent(newContent);

    // Update the timestamp optimistically
    const newTimestamp = new Date().toISOString();

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
