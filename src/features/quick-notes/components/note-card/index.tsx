"use client";

import { memo, useEffect, useRef, useState } from "react";
import { TextArea } from "react-aria-components";

import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import { noteFocusRegistry } from "../../hooks/use-add-quick-note";
import { useDeleteQuickNote } from "../../hooks/use-delete-quick-note";
import { useUpdateQuickNote } from "../../hooks/use-update-quick-note";
import type { NoteSummary } from "../../types/quick-notes.types";
import "./note-card.css";

import { DeleteProgressButton } from "@/shared/components/ui/delete-progress-button";

interface NoteCardProps {
  note: NoteSummary;
  hubColor: CustomColor | null;
}

const NoteCardComponent = ({ note, hubColor }: NoteCardProps) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const focusCheckedRef = useRef(false);

  const { content, isUnsaved, isSaving, handleContentChange } =
    useUpdateQuickNote({
      noteId: note.id,
      initialContent: note.content,
      hubId: note.hubId || 0,
      clientId: note.clientId, // Add clientId for optimistic note retry mechanism
    });

  const { mutate: deleteNote } = useDeleteQuickNote({
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

  const colorClasses = getCustomColorClasses(hubColor as CustomColor);

  const onFocus = () => {
    setIsEditingNote(true);
  };

  const onBlur = () => {
    setIsEditingNote(false);
  };

  const onDelete = () => {
    deleteNote({ id: note.id });
  };

  if (!note) return null;

  return (
    <div
      data-hub-id={note.hubId}
      className={cn(
        "bg-white group flex flex-col  rounded-lg border-1 border-border relative transition duration-250",
        "note-card focus-within:opacity-100! ",
        isEditingNote && `${colorClasses.border}`,
      )}
    >
      <DeleteProgressButton
        pressDuration={400}
        intent="plain"
        size="sq-xs"
        className={{
          container: cn(
            "block sm:hidden sm:group-hover:block absolute top-1.5 right-1.5",
          ),
          button:
            "size-6 **:data-[slot=icon]:size-3 **:data-[slot=icon]:text-danger rounded-full",
          progressCircle: "size-8",
        }}
        onDelete={onDelete}
      />
      {/* <div className="hidden absolute top-0 right-0 z-10">
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
      </div> */}
      <TextArea
        ref={textAreaRef}
        value={content}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Write something..."
        className={cn(
          "placeholder:text-muted-fg/40 field-sizing-content resize-none text-sm",
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
