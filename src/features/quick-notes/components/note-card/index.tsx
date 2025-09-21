"use client";

import { memo, useState } from "react";
import { TextArea } from "react-aria-components";

import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import { useDeleteQuickNote } from "../../hooks/use-delete-quick-note";
import { useUpdateQuickNote } from "../../hooks/use-update-quick-note";
import type { NoteSummary } from "../../types/quick-notes.types";
import "./note-card.css";

import { DeleteProgressButton } from "@/shared/components/ui/delete-progress-button";
import { useNotesLimits } from "@/shared/hooks/plan-limits/use-notes-limits";

interface NoteCardProps {
  note: NoteSummary;
  hubColor: CustomColor | null;
}

const NoteCardComponent = ({ note, hubColor }: NoteCardProps) => {
  const { maxCharacters } = useNotesLimits();
  const [isEditingNote, setIsEditingNote] = useState(false);

  const { content, isUnsaved, isSaving, handleContentChange } =
    useUpdateQuickNote({
      noteId: note.id,
      initialContent: note.content,
      hubId: note.hubId || 0,
      clientId: note.clientId,
    });

  const { mutate: deleteNote } = useDeleteQuickNote({
    hubId: note.hubId || 0,
  });

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
        "bg-white group flex flex-col shadow-xs rounded-lg border-1 border-border relative transition duration-250",
        "note-card focus-within:opacity-100! hover:shadow-sm",
        `hover:${colorClasses.border}`,
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

      <TextArea
        value={content}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Write something..."
        className={cn(
          "placeholder:text-muted-fg/40 field-sizing-content resize-none text-sm",
          "p-3 pr-8 pb-9",
        )}
        onChange={(e) => handleContentChange(e.target.value)}
        maxLength={maxCharacters}
      />
      <div className="absolute bottom-1 left-3  min-h-7">
        {isSaving && (
          <span className="text-xs text-muted-fg/50">Saving...</span>
        )}
        {!isSaving && isUnsaved && (
          <span className="text-xs text-muted-fg/50">Unsaved</span>
        )}
      </div>
      <div className="absolute bottom-1 right-3  min-h-7">
        <span className="text-xs text-muted-fg/50">
          {content.length}/{maxCharacters}
        </span>
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
    prevProps.hubColor === nextProps.hubColor
  );
});
