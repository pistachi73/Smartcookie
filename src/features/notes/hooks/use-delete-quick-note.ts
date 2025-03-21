import { deleteQuickNoteAction } from "@/features/notes/actions";
import type { NoteSummary } from "@/features/notes/types/quick-notes.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const DELETION_TIME_MS = 500;

interface UseDeleteQuickNoteProps {
  noteId: number;
  clientId?: string;
  hubId: number;
}

interface DeleteNoteData {
  id: number;
}

interface MutationContext {
  previousData: NoteSummary[] | undefined;
}

export const useDeleteQuickNote = ({
  noteId,
  clientId,
  hubId,
}: UseDeleteQuickNoteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const deleteAnimationRef = useRef<number | null>(null);
  const deletePressStartTimeRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  const { mutate: deleteNote } = useMutation({
    mutationKey: ["deleteQuickNote", noteId, clientId],
    mutationFn: async ({ id }: DeleteNoteData) => {
      const result = await deleteQuickNoteAction({ id });
      return result;
    },
    // Enable optimistic updates
    onMutate: async ({ id }: DeleteNoteData): Promise<MutationContext> => {
      // Cancel any outgoing refetches for this hub
      await queryClient.cancelQueries({ queryKey: ["hub-notes", hubId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<NoteSummary[]>([
        "hub-notes",
        hubId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<NoteSummary[]>(["hub-notes", hubId], (old) => {
        if (!old) return old;

        return old.filter((note) => note.id !== id);
      });

      return { previousData };
    },
    onSuccess: (_: any, __: DeleteNoteData) => {
      // No need to invalidate since we already updated optimistically
      // But we could refresh to ensure server-side consistency if needed
      // queryClient.invalidateQueries({ queryKey: ["hub-notes", hubId] });
    },
    onError: (err, data, context) => {
      toast.error("Failed to delete note");
      // If the mutation fails, roll back to the previous value
      if (context?.previousData) {
        queryClient.setQueryData<NoteSummary[]>(
          ["hub-notes", hubId],
          context.previousData,
        );
      }
    },
  });

  const cleanupDeleteAnimation = () => {
    if (deleteAnimationRef.current) {
      cancelAnimationFrame(deleteAnimationRef.current);
      deleteAnimationRef.current = null;
    }
    deletePressStartTimeRef.current = null;
    setIsDeleting(false);
    setDeleteProgress(0);
  };

  const handleDeletePress = () => {
    setIsDeleting(true);
    deletePressStartTimeRef.current = Date.now();

    const animateDeleteProgress = () => {
      if (!deletePressStartTimeRef.current) return;

      const elapsed = Date.now() - deletePressStartTimeRef.current;
      const progress = Math.min(elapsed / DELETION_TIME_MS, 1);
      const progressPercentage = progress * 100;
      setDeleteProgress(progressPercentage);

      if (progress < 1) {
        deleteAnimationRef.current = requestAnimationFrame(
          animateDeleteProgress,
        );
      } else {
        // We only pass id to the mutation since that's what the action expects
        deleteNote({ id: noteId });
        cleanupDeleteAnimation();
      }
    };

    deleteAnimationRef.current = requestAnimationFrame(animateDeleteProgress);
  };

  const handleDeleteRelease = () => {
    cleanupDeleteAnimation();
  };

  useEffect(() => {
    return cleanupDeleteAnimation;
  }, []);

  return {
    isDeleting,
    deleteProgress,
    handleDeletePress,
    handleDeleteRelease,
  };
};
