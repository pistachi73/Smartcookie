import { zodResolver } from "@hookform/resolvers/zod";
import * as m from "motion/react-m";
import { useRef } from "react";
import { TextArea } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/shared/components/ui/form";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import { useAddQuickNote } from "../../hooks/use-add-quick-note";

type AddQuickNoteProps = {
  hubId: number;
  onCancel: () => void;
};

const AddQuickNoteFormSchema = z.object({
  content: z.string().min(1),
});

const MotionForm = m.create(Form);

export const AddQuickNoteForm = ({ onCancel, hubId }: AddQuickNoteProps) => {
  const form = useForm<z.infer<typeof AddQuickNoteFormSchema>>({
    resolver: zodResolver(AddQuickNoteFormSchema),
    defaultValues: {
      content: "",
    },
  });
  const { mutateAsync: addNote, isPending } = useAddQuickNote();
  const isSubmitted = useRef(false);

  const handleRemoveAddingNote = () => {
    onCancel();
    setTimeout(() => {
      form.reset();
    }, 500);
  };

  const onSubmit = (data: z.infer<typeof AddQuickNoteFormSchema>) => {
    if (isSubmitted.current) return;
    if (!data.content.trim()) return;

    handleRemoveAddingNote();
    addNote({
      hubId,
      content: data.content,
      updatedAt: new Date().toISOString(),
    });
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
              "min-h-16 flex-1 text-sm p-2 border field-sizing-content resize-none border-dashed  rounded-lg bg-overlay-elevated-highlight",
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
