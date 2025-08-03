import { zodResolver } from "@hookform/resolvers/zod";
import * as m from "motion/react-m";
import { useRef } from "react";
import { TextArea } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shared/components/ui/form";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import type { SessionNotePosition } from "@/db/schema";
import { useAddSessionNote } from "../../../hooks/session-notes/use-add-session-note";

type AddSessionNoteProps = {
  sessionId: number;
  position: SessionNotePosition;
  onCancel: () => void;
};

const AddSessionNoteFormSchema = z.object({
  content: z.string().min(1),
});

const MotionForm = m.create(Form);

export const AddSessionNoteForm = ({
  onCancel,
  sessionId,
  position,
}: AddSessionNoteProps) => {
  const form = useForm<z.infer<typeof AddSessionNoteFormSchema>>({
    resolver: zodResolver(AddSessionNoteFormSchema),
    defaultValues: {
      content: "",
    },
  });
  const { mutateAsync: addNote, isPending } = useAddSessionNote();
  const isSubmitted = useRef(false);

  const handleRemoveAddingNote = () => {
    onCancel();
    setTimeout(() => {
      form.reset();
    }, 500);
  };

  const onSubmit = (data: z.infer<typeof AddSessionNoteFormSchema>) => {
    if (isSubmitted.current) return;
    if (!data.content.trim()) return;

    handleRemoveAddingNote();
    addNote({ sessionId, content: data.content, position });
    isSubmitted.current = true;
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }

    if (e.key === "Escape") {
      handleRemoveAddingNote();
    }
  };

  const handleBlur = () => {
    if (form.getValues("content").trim()) {
      form.handleSubmit(onSubmit)();
    } else {
      handleRemoveAddingNote();
    }
  };

  return (
    <MotionForm
      layout
      transition={{
        layout: regularSpring,
      }}
      className="flex flex-row items-center gap-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="content"
        control={form.control}
        render={({ field }) => (
          <TextArea
            {...field}
            autoFocus
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onKeyDown={handleTextAreaKeyDown}
            onBlur={handleBlur}
            className={cn(
              "flex-1 text-sm p-2 border field-sizing-content resize-none border-dashed  rounded-lg bg-overlay-elevated-highlight",
              "focus-visible:border-primary",
              isPending && "opacity-50 cursor-not-allowed",
            )}
            placeholder={"Type and press enter..."}
            aria-label="Add session note"
          />
        )}
      />
    </MotionForm>
  );
};
