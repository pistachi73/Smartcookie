"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  RankingIcon as RakingIconSolid,
  TextIcon as TextIconSolid,
  ThumbsUpIcon as ThumbsUpIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  AddIcon,
  RankingIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import {
  RadioToggle,
  RadioToggleGroup,
} from "@/shared/components/ui/radio-toggle-group";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/classes";

import type { CreateQuestionSchema } from "@/data-access/questions/schemas";
import type { QuestionType } from "@/db/schema";

const questionTypes: {
  id: QuestionType;
  label: string;
  description: string;
  icon: typeof TextIcon;
  altIcon: typeof ThumbsUpIcon;
}[] = [
  {
    id: "text",
    label: "Text",
    description: "Open-ended responses",
    icon: TextIcon,
    altIcon: TextIconSolid,
  },
  {
    id: "rating",
    label: "Rating",
    description: "1-10 scale rating",
    icon: RankingIcon,
    altIcon: RakingIconSolid,
  },
  {
    id: "boolean",
    label: "Yes/No",
    description: "Simple yes/no choice",
    icon: ThumbsUpIcon,
    altIcon: ThumbsUpIconSolid,
  },
];

export interface QuestionFormProps {
  form: UseFormReturn<z.infer<typeof CreateQuestionSchema>>;
  onSubmit: (data: z.infer<typeof CreateQuestionSchema>) => void;
  isPending: boolean;
  submitButtonText: string;
  loadingText: string;
  disabledFields?: Partial<
    Record<keyof z.infer<typeof CreateQuestionSchema>, boolean>
  >;
}

export const QuestionForm = ({
  form,
  onSubmit,
  isPending,
  submitButtonText,
  loadingText,
  disabledFields,
}: QuestionFormProps) => {
  return (
    <Form className="w-full space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Question Input Section */}
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            isRequired
            label="Question Title"
            placeholder="e.g., What improvements would you suggest for our classes?"
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
          />
        )}
      />

      <Controller
        control={form.control}
        name="questionType"
        render={({ field, fieldState }) => (
          <RadioToggleGroup
            value={field.value}
            onChange={field.onChange}
            orientation="horizontal"
            label="Question Type"
            isRequired
            gap={2}
            size="medium"
            appearance="outline"
            isDisabled={!!disabledFields?.questionType}
            errorMessage={fieldState.error?.message}
            className={{
              content: "flex-1 flex-wrap",
            }}
          >
            {questionTypes.map(({ id, label, icon, altIcon, description }) => (
              <RadioToggle
                key={id}
                value={id}
                className={({ isSelected }) =>
                  cn(
                    "flex-col flex-1 gap-2 h-auto w-full p-5",
                    isSelected &&
                      "bg-primary-tint/50! inset-ring-primary! transition-colors",
                  )
                }
              >
                <HugeiconsIcon
                  icon={icon}
                  altIcon={altIcon}
                  showAlt={field.value === id}
                  size={20}
                  className={cn(field.value === id && "text-primary")}
                />
                <div className="space-y-0-5 text-center">
                  <p className="font-medium text-base">{label}</p>

                  <p className="text-sm text-muted-fg text-center">
                    {description}
                  </p>
                </div>
              </RadioToggle>
            ))}
          </RadioToggleGroup>
        )}
      />

      {/* Description Section */}
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            label="Description"
            {...field}
            placeholder="Provide additional context or instructions for this question (optional)"
            className={{
              textarea: "h-32 resize-none",
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
          />
        )}
      />

      {/* Additional Options Section */}
      {/* <div className="rounded-lg border border-input">
        <Heading level={4} className="px-4 py-3 text-sm">
          Additional Options
        </Heading>
        <Separator className="border-input" />
        <Controller
          control={form.control}
          name="enableAdditionalComment"
          render={({ field }) => (
            <Checkbox
              id="enableAdditionalComment"
              isSelected={field.value}
              onChange={(isSelected) => {
                field.onChange(isSelected);
              }}
              label="Allow additional comments"
              className="w-full px-4 py-4"
            />
          )}
        />
      </div> */}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="w-fit px-6" isPending={isPending}>
          {isPending ? (
            <ProgressCircle isIndeterminate aria-label={loadingText} />
          ) : (
            <HugeiconsIcon icon={AddIcon} data-slot="icon" />
          )}
          {isPending ? loadingText : submitButtonText}
        </Button>
      </div>
    </Form>
  );
};
