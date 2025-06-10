import { updateQuickNote } from "@/data-access/quick-notes/mutations";
import { UpdateQuickNoteSchema } from "@/data-access/quick-notes/schemas";
import type { NoteSummary } from "@/features/quick-notes/types/quick-notes.types";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface UseUpdateQuickNoteProps {
  noteId: number;
  initialContent: string;
  hubId: number;
}

interface MutationContext {
  previousData: NoteSummary[] | undefined;
}

export const useUpdateQuickNote = ({
  noteId,
  initialContent,
  hubId,
}: UseUpdateQuickNoteProps) => {
  const [content, setContent] = useState(initialContent);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    onError: (err, _, context) => {
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

      // Use the optimistic updatedAt value since the server response doesn't include it
      // This is fine because we're already using the client timestamp for optimistic updates

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

  const debouncedSave = (newContent: string, newUpdatedAt: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
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
    };
  }, []);

  return {
    content,
    isUnsaved,
    isSaving,
    handleContentChange,
  };
};
