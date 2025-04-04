import type { SessionNotePosition } from "@/db/schema";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import * as m from "motion/react-m";
import { useRef, useState } from "react";
import { TextArea } from "react-aria-components";
import { useAddSessionNote } from "../../hooks/session-notes/use-add-session-note";

type AddSessionNoteProps = {
  sessionId: number;
  position: SessionNotePosition;
  onCancel: () => void;
};

export const AddSessionNoteForm = ({
  onCancel,
  sessionId,
  position,
}: AddSessionNoteProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [noteContent, setNoteContent] = useState<string>("");
  const { mutateAsync: addNote } = useAddSessionNote();

  const handleRemoveAddingNote = () => {
    onCancel();
    setTimeout(() => {
      setNoteContent("");
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (noteContent.trim()) {
      setIsDisabled(true);
      handleRemoveAddingNote();
      addNote({ sessionId, content: noteContent, position });
      setIsDisabled(false);
    }
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.dispatchEvent(new Event("submit", { bubbles: true }));
    }

    if (e.key === "Escape") {
      handleRemoveAddingNote();
    }
  };
  return (
    <m.form
      layout
      transition={{
        layout: regularSpring,
      }}
      className="flex flex-row items-center gap-2"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <TextArea
        autoFocus
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        onKeyDown={handleTextAreaKeyDown}
        onBlur={handleRemoveAddingNote}
        className={cn(
          "flex-1 text-base p-2 border field-sizing-content resize-none border-dashed  rounded-lg bg-overlay-elevated-highlight",
          "focus-visible:border-primary",
        )}
        placeholder="Type and press enter..."
      />
    </m.form>
  );
};
