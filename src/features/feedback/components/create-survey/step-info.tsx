"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight02Icon } from "@hugeicons-pro/core-solid-rounded";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CreateSurveySchema } from "../../lib/surveys.schema";
import { useCreateSurveyFormStore } from "../../store/create-survey-multistep-form.store";

import { HugeiconsIcon } from "@hugeicons/react";

// Create a schema with only title and description
const SurveyInfoSchema = z.object({
  title: CreateSurveySchema.shape.title,
  description: CreateSurveySchema.shape.description,
});

type SurveyInfoFormValues = z.infer<typeof SurveyInfoSchema>;

export function StepInfo() {
  const formData = useCreateSurveyFormStore((state) => state.surveyInfo);
  const setFormData = useCreateSurveyFormStore((state) => state.setFormData);
  const nextStep = useCreateSurveyFormStore((state) => state.nextStep);

  const { control, handleSubmit } = useForm<SurveyInfoFormValues>({
    resolver: zodResolver(SurveyInfoSchema),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: SurveyInfoFormValues) => {
    setFormData({
      title: data.title,
      description: data.description,
    });
    nextStep();
  };

  return (
    <Form
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
      id="step-form"
    >
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Survey Title"
            isRequired
            placeholder="e.g., Student Experience Survey"
            className={{ input: "text-sm" }}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Description"
            placeholder="Brief explanation of the survey purpose"
            className={{
              primitive: "h-32",
              textarea: "resize-none text-sm",
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
          />
        )}
      />

      <div className="flex justify-end w-full">
        <Button type="submit">
          Next
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-slot="icon" />
        </Button>
      </div>
    </Form>
  );
}
