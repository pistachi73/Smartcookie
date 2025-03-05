"use client";

import { Button } from "@/components/ui";
import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { NoteAddIcon } from "@hugeicons/react";

interface AddNoteCardProps {
  hubId: number;
}

export const AddNoteCard = ({ hubId }: AddNoteCardProps) => {
  const addNote = useQuickNotesStore((state) => state.addNote);
  return (
    <div className='rounded-lg border border-primary border-dashed p-6 flex items-center justify-center bg-primary/5'>
      <Button
        intent='primary'
        appearance='solid'
        size='small'
        // onPress={() => addNote({ hubId, content: "" })}
      >
        Create a note <NoteAddIcon size={16} />
      </Button>
    </div>
  );
};
