"use client";

import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import type { z } from "zod";

import { CustomColorPicker } from "@/shared/components/ui/custom-color-picker";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label } from "@/shared/components/ui/field";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/classes";

import type { hubInfoSchema } from "../../../lib/schemas";

export const EditHubForm = ({ isDisabled }: { isDisabled: boolean }) => {
  const form = useFormContext<z.infer<typeof hubInfoSchema>>();

  const formState = useFormState({
    control: form.control,
  });

  const startDate = useWatch({
    control: form.control,
    name: "startDate",
  });

  const { control } = form;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label isRequired>Name</Label>
        <div className="flex gap-2 items-center">
          <Controller
            name="color"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div
                className={cn(
                  Boolean(formState.errors.name?.message) && "-mt-7.5",
                )}
              >
                <CustomColorPicker
                  isDisabled={isDisabled}
                  selectedKey={value}
                  onSelectionChange={onChange}
                  aria-label="Course color picker"
                />
              </div>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                placeholder="My Course"
                isRequired
                isDisabled={isDisabled}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                className={{
                  primitive: "flex-1 w-full",
                  fieldGroup: "h-10",
                }}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value }, fieldState }) => (
            <DatePicker
              label="Start Date"
              isRequired
              className="w-full"
              value={value}
              onChange={onChange}
              validationBehavior="aria"
              isDisabled={isDisabled}
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
              className="w-full"
              value={value}
              onChange={onChange}
              minValue={startDate}
              isDisabled={isDisabled}
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
            placeholder="This course is for..."
            isDisabled={isDisabled}
            errorMessage={fieldState.error?.message}
            description="Briefly describe what this course is about"
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
              isDisabled={isDisabled}
              errorMessage={fieldState.error?.message}
              description="Max 20 characters"
              maxLength={20}
              className={{ primitive: "flex-1", fieldGroup: "h-10" }}
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
              isDisabled={isDisabled}
              errorMessage={fieldState.error?.message}
              description="Optional schedule information"
              className={{ primitive: "flex-1", fieldGroup: "h-10" }}
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
};
