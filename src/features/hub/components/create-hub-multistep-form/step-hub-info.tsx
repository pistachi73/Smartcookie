"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { CustomColorPicker } from "@/shared/components/ui/custom-color-picker";
import { DatePicker } from "@/shared/components/ui/date-picker/index";
import { Label } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/classes";

import { hubInfoSchema } from "../../lib/schemas";
import { useHubFormStore } from "../../store/hub-form-store";

export function StepHubInfo() {
  const setHubInfo = useHubFormStore((state) => state.setHubInfo);
  const nextStep = useHubFormStore((state) => state.nextStep);
  const hubInfo = useHubFormStore((state) => state.hubInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof hubInfoSchema>>({
    resolver: zodResolver(hubInfoSchema),
    defaultValues: hubInfo,
    mode: "onChange",
  });

  const startDate = useWatch({ control, name: "startDate" });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof hubInfoSchema>) => {
    setHubInfo(data);
    nextStep();
  };

  console.log(errors);

  return (
    <Form
      id="step-form"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label isRequired>Name</Label>
        <div className="flex gap-2 items-center">
          <Controller
            name="color"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className={cn(Boolean(errors.name?.message) && "-mt-7.5")}>
                <CustomColorPicker
                  selectedKey={value}
                  onSelectionChange={onChange}
                  aria-label="Hub color picker"
                />
              </div>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                placeholder="My Hub"
                isRequired
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                className={{ primitive: "flex-1 w-full" }}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value }, fieldState }) => (
            <DatePicker
              label="Start Date"
              isRequired
              className={{
                primitive: "flex-1",
              }}
              value={value}
              onChange={onChange}
              validationBehavior="aria"
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field: { onChange, value }, fieldState }) => (
            <DatePicker
              label="End Date"
              className={{
                primitive: "flex-1",
              }}
              value={value}
              onChange={onChange}
              minValue={startDate}
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            label="Description"
            placeholder="This hub is for..."
            errorMessage={fieldState.error?.message}
            description="Briefly describe what this hub is about"
            {...field}
          />
        )}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Controller
          name="level"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Level"
              placeholder="Beginner"
              errorMessage={fieldState.error?.message}
              description="Max 20 characters"
              maxLength={20}
              className={{ primitive: "flex-1" }}
              {...field}
            />
          )}
        />
        <Controller
          name="schedule"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Schedule"
              placeholder="Weekly on Mondays"
              errorMessage={fieldState.error?.message}
              description="Optional schedule information"
              className={{ primitive: "flex-1" }}
              {...field}
            />
          )}
        />
      </div>

      <div className="mb-0! h-20 w-full block sm:hidden" aria-hidden="true" />
      <div
        className={cn(
          "flex flex-col fixed bottom-0 border-t left-0 bg-overlay p-4 w-full",
          "sm:relative sm:p-0 sm:flex-row sm:justify-end sm:border-none",
        )}
      >
        <Button type="submit" className="px-6">
          Continue to students
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-slot="icon" />
        </Button>
      </div>
    </Form>
  );
}
