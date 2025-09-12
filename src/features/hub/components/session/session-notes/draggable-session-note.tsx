import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropVerticalIcon } from "@hugeicons-pro/core-solid-rounded";
import { useRef } from "react";
import { useButton, useDrag } from "react-aria";
import { TextArea } from "react-aria-components";

import { DeleteProgressButton } from "@/shared/components/ui/delete-progress-button";
import { cn } from "@/shared/lib/classes";

import { useUpdateSessionNoteContent } from "@/features/hub/hooks/session-notes/use-update-session-note-content";
import { useDeleteSessionNote } from "../../../hooks/session-notes/use-delete-session-note";
import type { ClientSessionNote } from "../../../types/session-notes.types";

type DraggableSessionNoteProps = {
  note: ClientSessionNote;
  sessionId: number;
};

export const DraggableSessionNote = ({
  note,
  sessionId,
}: DraggableSessionNoteProps) => {
  const { mutate: handleDelete } = useDeleteSessionNote();
  const { content, isSaving, handleContentChange } =
    useUpdateSessionNoteContent({
      noteId: note.id,
      initialContent: note.content,
      sessionId,
      clientId: note.clientId, // Add clientId for optimistic note retry mechanism
    });
  const { dragProps, isDragging, dragButtonProps } = useDrag({
    hasDragButton: true,
    getItems() {
      return [
        {
          "session-note": JSON.stringify(note),
          content: note.content,
        },
      ];
    },
    isDisabled: isSaving,
  });

  const dragButtonRef = useRef(null);
  const { buttonProps } = useButton(
    { ...dragButtonProps, elementType: "div" },
    dragButtonRef,
  );

  const onDelete = () => {
    handleDelete({ noteId: note.id, sessionId });
  };

  return (
    <div
      {...dragProps}
      className={cn(
        "group relative flex flex-row items-center gap-1",
        "rounded-lg  transition-all duration-200 not-last:mb-1",
        "focus-visible:border-primary focus-visible:bg-primary/10",
        "border dark:border-transparent hover:border-fg/30",
        "bg-overlay dark:bg-overlay-elevated",
        isDragging && "opacity-40 cursor-grabbing scale-95",
      )}
    >
      <span
        {...buttonProps}
        ref={dragButtonRef}
        className="rounded-xs focus-visible:ring-2 p-0.5 pl-2 ring-primary text-muted-fg shrink-0 cursor-grab"
      >
        <HugeiconsIcon
          icon={DragDropVerticalIcon}
          size={14}
          className="shrink-0"
        />
      </span>

      <TextArea
        value={content}
        placeholder="Write something..."
        className={cn(
          "w-full py-3 pr-4 placeholder:text-muted-fg/40 field-sizing-content resize-none text-sm",
          "pr-8 ",
        )}
        onChange={(e) => handleContentChange(e.target.value, note.position)}
      />

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
    </div>
  );
};
