"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-solid-rounded";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";

import { CreateSurveyTemplateSchema } from "@/data-access/survey-templates/schemas";
import { useSurveyTemplateFormStore } from "../../../store/survey-template-form.store";

// Create a schema with only title and description
const schema = z.object({
  title: CreateSurveyTemplateSchema.shape.title,
  description: CreateSurveyTemplateSchema.shape.description,
});

type SurveyInfoFormValues = z.infer<typeof schema>;

export function StepInfo() {
  const formData = useSurveyTemplateFormStore((state) => state.surveyInfo);
  const setFormData = useSurveyTemplateFormStore((state) => state.setFormData);
  const nextStep = useSurveyTemplateFormStore((state) => state.nextStep);
  const mode = useSurveyTemplateFormStore((state) => state.mode);

  const { control, handleSubmit, setValue } = useForm<SurveyInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit") {
      setValue("title", formData.title || "");
      setValue("description", formData.description || "");
    }
  }, [formData, mode, setValue]);

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
            autoFocus
            placeholder="e.g., Student Experience Survey"
            maxLength={255}
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
            maxLength={1000}
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
