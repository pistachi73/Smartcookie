import { addQuickNoteAction } from "@/features/notes/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { NoteSummary } from "../types/quick-notes.types";

export type UseAddQuickNoteProps = {
  cleanFocusRegisterOnAdd?: boolean;
};

// Match the exact type expected by the action
interface AddQuickNoteData {
  content: string;
  hubId: number;
  updatedAt: string;
}

interface MutationContext {
  previousData: NoteSummary[] | undefined;
  optimisticId: number;
  clientId: string;
  hubId: number;
}

// Create a global registry for notes that need focus
export const noteFocusRegistry = {
  // Store clientIds that need focus
  pendingFocus: new Set<string>(),

  // Register a note for focus
  register(clientId: string) {
    this.pendingFocus.add(clientId);
  },

  clean() {
    this.pendingFocus.clear();
  },

  // Check if a note needs focus and consume the focus request
  shouldFocus(clientId: string) {
    if (this.pendingFocus.has(clientId)) {
      this.pendingFocus.delete(clientId);
      return true;
    }
    return false;
  },
};

export const useAddQuickNote = (options?: UseAddQuickNoteProps) => {
  const queryClient = useQueryClient();
  const { cleanFocusRegisterOnAdd = false } = options || {};

  return useMutation({
    mutationFn: addQuickNoteAction,
    onMutate: async (newNote: AddQuickNoteData): Promise<MutationContext> => {
      // Cancel any outgoing refetches for the specific hub
      const hubId = newNote.hubId;
      await queryClient.cancelQueries({ queryKey: ["hub-notes", hubId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<NoteSummary[]>([
        "hub-notes",
        hubId,
      ]);

      // Create an optimistic note with a temporary ID and a clientId for animation stability
      const optimisticId = -Date.now(); // Use negative number to avoid collisions
      const clientId = `client-${Date.now()}`; // Stable ID for animations

      const optimisticNote: NoteSummary = {
        id: optimisticId,
        content: newNote.content,
        updatedAt: newNote.updatedAt,
        hubId: newNote.hubId,
        clientId, // Add clientId for animation stability
      };

      // If the note is being added, clean the focus registry
      if (cleanFocusRegisterOnAdd) {
        noteFocusRegistry.clean();
      }

      // Register this note for focus before updating the cache
      noteFocusRegistry.register(clientId);

      // Optimistically update the hub-specific cache
      queryClient.setQueryData<NoteSummary[]>(["hub-notes", hubId], (old) => {
        if (!old) return [optimisticNote];
        return [optimisticNote, ...old];
      });

      return { previousData, optimisticId, clientId, hubId };
    },
    onError: (err, _, context) => {
      // Revert the optimistic update
      if (context?.hubId !== undefined) {
        queryClient.setQueryData<NoteSummary[]>(
          ["hub-notes", context.hubId],
          context.previousData,
        );
      }
      console.error(err);
      toast.error("Failed to add note");
    },
    onSuccess: (response, _, context) => {
      if (!response?.data || !context) return;

      const { hubId, optimisticId, clientId } = context;
      const newNote = response.data;

      // Replace the optimistic note with the real one
      queryClient.setQueryData<NoteSummary[]>(["hub-notes", hubId], (old) => {
        if (!old) return old;

        return old.map((note) => {
          if (note.id === optimisticId) {
            // Return the server note but keep the clientId for animation stability
            return {
              ...newNote,
              clientId, // Keep the clientId for animation stability
            };
          }
          return note;
        });
      });
    },
  });
};
