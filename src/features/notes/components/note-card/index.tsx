"use client";

import { noteFocusRegistry } from "@/features/notes/hooks/use-add-quick-note";
import { useDeleteQuickNote } from "@/features/notes/hooks/use-delete-quick-note";
import { useUpdateQuickNote } from "@/features/notes/hooks/use-update-quick-note";
import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
import { cn } from "@/shared/lib/classes";
import type { CustomColor } from "@/shared/lib/custom-colors";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { ProgressCircle } from "@/ui/progress-circle";
import { Delete01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { memo, useEffect, useRef, useState } from "react";
import { Button, TextArea } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import type { NoteSummary } from "../../types/quick-notes.types";
interface NoteCardProps {
  note: NoteSummary;
  index?: number;
  hubColor?: CustomColor;
}

const NoteCardComponent = ({ note, index = 0, hubColor }: NoteCardProps) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const focusCheckedRef = useRef(false);

  const { edittingHub, setEdittingHub } = useQuickNotesStore(
    useShallow((state) => ({
      edittingHub: state.edittingHub,
      setEdittingHub: state.setEdittingHub,
    })),
  );

  const { content, isUnsaved, isSaving, handleContentChange } =
    useUpdateQuickNote({
      noteId: note.id,
      initialContent: note.content,
      hubId: note.hubId || 0,
    });

  const { isDeleting, deleteProgress, handleDeletePress, handleDeleteRelease } =
    useDeleteQuickNote({
      noteId: note.id,
      clientId: note.clientId,
      hubId: note.hubId || 0,
    });

  // Check if this note needs focus when it mounts
  useEffect(() => {
    if (focusCheckedRef.current || !textAreaRef.current) return;
    focusCheckedRef.current = true;

    if (note.clientId && noteFocusRegistry.shouldFocus(note.clientId)) {
      textAreaRef.current.focus();
    }
  }, [note.clientId]);

  const isDisabled = (edittingHub || 0) === note.hubId && !isEditingNote;
  const colorClasses = getCustomColorClasses(hubColor as CustomColor);

  const onFocus = () => {
    setIsEditingNote(true);
    setEdittingHub(note.hubId);
  };

  const onBlur = () => {
    setIsEditingNote(false);
    setEdittingHub(null);
  };

  if (!note) return null;

  return (
    <div
      className={cn(
        "flex flex-col bg-overlay-highlight rounded-lg border-1 border-border relative transition duration-250",
        isDisabled && "opacity-50",
        isEditingNote
          ? `brightness-125 ${colorClasses.border}`
          : "hover:bg-overlay-elevated-highlight/80",
      )}
    >
      <div className="absolute top-0 right-0 z-10">
        <Button
          excludeFromTabOrder
          isDisabled={note.id < 0}
          onPressStart={handleDeletePress}
          onPressEnd={handleDeleteRelease}
          aria-label="Delete note"
          className={({ isDisabled }) =>
            cn(
              "size-9 z-20 flex items-center justify-center text-muted-fg hover:bg-transparent!",
              isDisabled && "opacity-50",
            )
          }
        >
          <HugeiconsIcon
            icon={Delete01Icon}
            size={14}
            className={cn("transition-colors", isDeleting && "text-danger")}
          />
        </Button>
        <AnimatePresence>
          {isDeleting && (
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            >
              <ProgressCircle
                value={deleteProgress}
                strokeWidth={2}
                aria-label="Delete progress circle"
                className="size-8 text-danger"
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <TextArea
        ref={textAreaRef}
        value={content}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Write something..."
        className={cn(
          "placeholder:text-muted-fg/40 field-sizing-content resize-none text-base",
          "p-3 pr-8 pb-2",
        )}
        onChange={(e) => handleContentChange(e.target.value)}
      />
      <div className="flex justify-between items-center p-3 pt-0 pb-3 min-h-7">
        {isSaving && (
          <span className="text-xs text-muted-fg/50">Saving...</span>
        )}
        {!isSaving && isUnsaved && (
          <span className="text-xs text-muted-fg/50">Unsaved</span>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const NoteCard = memo(NoteCardComponent, (prevProps, nextProps) => {
  // Return true if the component should NOT re-render
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.content === nextProps.note.content &&
    prevProps.note.updatedAt === nextProps.note.updatedAt &&
    prevProps.hubColor === nextProps.hubColor
  );
});
