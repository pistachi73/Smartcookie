"use client";

import { useAddQuickNote } from "@/components/portal/quick-notes/hooks/use-add-quick-note";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
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
      appearance="plain"
      onPress={handleAddEmptyNote}
      isDisabled={isDisabled}
      className={cn(
        "rounded-lg border justify-center gap-2 font-medium text-primary group-hover:text-primary/80 border-primary/30 border-dashed p-3 flex items-center transition-colors group",
        isDisabled
          ? "bg-primary/5 opacity-70 cursor-not-allowed"
          : "bg-primary/5 hover:bg-primary/10",
      )}
    >
      <HugeiconsIcon icon={NoteAddIconSolid} size={16} />
    </Button>
  );
};
