"use client";

import type { QuestionType } from "@/db/schema";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { Toggle, ToggleGroup } from "@/shared/components/ui/toggle-group";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RankingIcon as RakingIconSolid,
  ThumbsUpIcon as ThumbsUpIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  RankingIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateQuestion } from "../hooks/use-create-question";
import { newQuestionFormSchema } from "../lib/questions.schema";

const questionTypes: {
  id: QuestionType;
  label: string;
  icon: typeof TextIcon;
  altIcon: typeof ThumbsUpIcon;
}[] = [
  {
    id: "text",
    label: "Text",
    icon: TextIcon,
    altIcon: TextIcon,
  },
  {
    id: "rating",
    label: "Rating",
    icon: RankingIcon,
    altIcon: RakingIconSolid,
  },
  {
    id: "boolean",
    label: "Yes/No",
    icon: ThumbsUpIcon,
    altIcon: ThumbsUpIconSolid,
  },
];

export const CreateQuestion = () => {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();

  const form = useForm<z.infer<typeof newQuestionFormSchema>>({
    resolver: zodResolver(newQuestionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      enableAdditionalComment: false,
      questionType: "text",
    },
  });

  const backHref = createHrefWithParams("/portal/feedback");
  const { mutate, isPending } = useCreateQuestion({
    onSuccess: () => {
      router.push(backHref);
    },
  });

  const onSubmit = (data: z.infer<typeof newQuestionFormSchema>) => {
    mutate(data);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Link
        intent="secondary"
        href={backHref}
        className="flex items-center gap-1.5 text-sm"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link>

      <div className="space-y-1">
        <Heading level={2}>Create Question</Heading>
        <p className="text-sm text-muted-fg">
          Create a question to collect feedback from your users.
        </p>
      </div>
      <Form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Question"
              isRequired
              placeholder="e.g., What improvements would you suggest for our classes?"
              className={{ input: "text-sm" }}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />

        <div className="gap-1.5 flex flex-col">
          <Label isRequired>Question Type</Label>
          <Controller
            control={form.control}
            name="questionType"
            render={({ field }) => (
              <ToggleGroup
                gap={2}
                selectionMode="single"
                className="flex-1 flex-wrap"
                selectedKeys={[field.value]}
                aria-label="Question type"
                onSelectionChange={(value) => {
                  const status = Array.from(value)[0];
                  field.onChange(status);
                }}
              >
                {questionTypes.map(({ id, label, icon, altIcon }) => (
                  <Toggle
                    appearance="outline"
                    key={id}
                    id={id}
                    className={({ isSelected }) =>
                      cn(
                        "grow-1 min-w-0 flex-col flex-1 gap-1.5 h-auto w-full p-5",
                        isSelected
                          ? "bg-primary-tint! inset-ring-primary! font-medium"
                          : "text-muted-fg",
                      )
                    }
                  >
                    {({ isSelected }) => (
                      <>
                        <HugeiconsIcon
                          icon={icon}
                          altIcon={altIcon}
                          showAlt={isSelected}
                          size={18}
                          className={cn(isSelected && "text-primary")}
                        />
                        {label}
                      </>
                    )}
                  </Toggle>
                ))}
              </ToggleGroup>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              label="Description"
              placeholder="Additional context for the question"
              className={{
                primitive: "h-32",
                textarea: "resize-none text-sm",
              }}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />

        <div className="flex items-center gap-2">
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
              >
                Allow additional comments
              </Checkbox>
            )}
          />
        </div>
        <Button type="submit" className="w-full" isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Creating ..." />
          )}
          {isPending ? "Creating..." : "Create Question"}
        </Button>
      </Form>
    </div>
  );
};
