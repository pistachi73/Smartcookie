import { DeleteProgressButton } from "@/shared/components/ui/delete-progress-button";
import { cn } from "@/shared/lib/classes";
import { DragDropVerticalIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";
import { useButton, useDrag } from "react-aria";
import { useDeleteSessionNote } from "../../../hooks/session-notes/use-delete-session-note";
import type { SessionNote } from "../../../types/session-notes.types";
type DraggableSessionNoteProps = {
  note: SessionNote;
  sessionId: number;
};

export const DraggableSessionNote = ({
  note,
  sessionId,
}: DraggableSessionNoteProps) => {
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
  });

  const { mutate: handleDelete } = useDeleteSessionNote();

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
        "p-2 rounded-lg  transition-all duration-200 not-last:mb-1",
        "focus-visible:border-primary focus-visible:bg-primary/10",
        "cursor-grab",
        "border dark:border-transparent hover:border-fg/30",
        "bg-overlay dark:bg-overlay-elevated",
        isDragging && "opacity-40 cursor-grabbing scale-95",
      )}
    >
      <span
        {...buttonProps}
        ref={dragButtonRef}
        className="rounded-xs focus-visible:ring-2 p-0.5 mr-0.5 ring-primary text-muted-fg"
      >
        <HugeiconsIcon
          icon={DragDropVerticalIcon}
          size={12}
          className="shrink-0"
        />
      </span>
      <p className="text-sm pr-4 overflow-hidden">{note.content}</p>
      <DeleteProgressButton
        pressDuration={400}
        className={{
          container:
            "block sm:hidden sm:group-hover:block absolute top-0 right-0",
          button:
            "size-7 **:data-[slot=icon]:size-3 hover:bg-overlay-elevated bg-overlay-elevated rounded-full",
          progressCircle: "size-7",
        }}
        onDelete={onDelete}
      />
    </div>
  );
};
