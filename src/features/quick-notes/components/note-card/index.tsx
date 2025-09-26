"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import { useDeleteQuickNote } from "../../hooks/use-delete-quick-note";
import { useUpdateQuickNote } from "../../hooks/use-update-quick-note";
import type { NoteSummary } from "../../types/quick-notes.types";
import "./note-card.css";

import { TextArea } from "react-aria-components";

import { DeleteProgressButton } from "@/shared/components/ui/delete-progress-button";
import { PreviewLinks } from "@/shared/components/ui/preview-links";
import { useNotesLimits } from "@/shared/hooks/plan-limits/use-notes-limits";

interface NoteCardProps {
  note: NoteSummary;
  hubColor: CustomColor | null;
  isViewOnlyMode?: boolean;
}

export const NoteCard = ({
  note,
  hubColor,
  isViewOnlyMode = false,
}: NoteCardProps) => {
  const { maxCharacters } = useNotesLimits();
  const [isEditingNote, setIsEditingNote] = useState(false);

  const { content, isUnsaved, isSaving, handleContentChange, urls } =
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
        "relative bg-white group flex flex-col shadow-xs rounded-lg border-1 border-border transition duration-250",
        "note-card focus-within:opacity-100! hover:shadow-sm",
        `hover:${colorClasses.border}`,
        isEditingNote && `${colorClasses.border}`,
      )}
    >
      {!isViewOnlyMode && (
        <DeleteProgressButton
          pressDuration={300}
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
      )}

      <TextArea
        value={content}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Write something..."
        className={cn(
          "placeholder:text-muted-fg/40 field-sizing-content resize-none text-sm",
          "p-3 pr-8 pb-3",
        )}
        onChange={(e) => {
          handleContentChange(e.target.value);
        }}
        maxLength={maxCharacters}
        readOnly={isViewOnlyMode}
      />

      <div className="px-3 pb-1 flex items-center justify-between h-8">
        <div className="">
          {isSaving && (
            <span className="text-xs text-muted-fg/50">Saving...</span>
          )}
          {!isSaving && isUnsaved && (
            <span className="text-xs text-muted-fg/50">Unsaved</span>
          )}
        </div>

        <span className="text-xs text-muted-fg/50">
          {content.length}/{maxCharacters}
        </span>
      </div>

      <PreviewLinks
        urls={urls}
        isViewOnlyMode={isViewOnlyMode}
        className="px-3 pb-3 space-y-2"
      />
    </div>
  );
};
