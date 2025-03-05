import { addQuickNoteAction } from "@/app/(portal)/quick-notes/actions";
import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { useMutation } from "@tanstack/react-query";

export const useAddQuickNote = () => {
  const addNote = useQuickNotesStore((state) => state.addNote);
  const replaceNoteId = useQuickNotesStore((state) => state.replaceNoteId);
  const { mutate } = useMutation({
    mutationFn: addQuickNoteAction,
    onMutate: (data) => {
      addNote(data);
      //update the store
    },

    onError: (data) => {},
  });
  return addNote;
};
