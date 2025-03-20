"use client";

import { useAddQuickNote } from "@/features/notes/hooks/use-add-quick-note";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/classes";
import { NoteAddIcon as NoteAddIconSolid } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";

interface AddNoteCardProps {
  hubId: number;
}

const COOLDOWN_DURATION = 1000; // 1 second cooldown

export const AddNoteCard = ({ hubId }: AddNoteCardProps) => {
  const { mutate: addNote } = useAddQuickNote();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleAddEmptyNote = useCallback(() => {
    if (isDisabled) return;

    addNote({
      hubId,
      content: "",
      updatedAt: new Date().toISOString(),
    });

    setIsDisabled(true);

    // Simple timeout to re-enable the button after cooldown
    setTimeout(() => {
      setIsDisabled(false);
    }, COOLDOWN_DURATION);
  }, [addNote, hubId, isDisabled]);

  return (
    <Button
      size="square-petite"
      appearance="outline"
      shape="square"
      onPress={handleAddEmptyNote}
      isDisabled={isDisabled}
      className={cn()}
    >
      <HugeiconsIcon icon={NoteAddIconSolid} size={16} />
    </Button>
  );
};
