"use client";

import { CustomColorPicker } from "@/shared/components/ui/custom-color-picker";
import { DatePicker } from "@/shared/components/ui/date-picker/index";
import { Form } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type HubFormValues, hubFormSchema } from "../../lib/schemas";
import { useHubFormStore } from "../../store/hub-form-store";

export function StepHubInfo() {
  const hubInfo = useHubFormStore((state) => state.hubInfo);
  const setHubInfo = useHubFormStore((state) => state.setHubInfo);
  const setStepValidation = useHubFormStore((state) => state.setStepValidation);

  const { control, handleSubmit, watch, formState } = useForm<HubFormValues>({
    resolver: zodResolver(hubFormSchema),
    defaultValues: hubInfo,
  });

  const hasEndDate = watch("hasEndDate");

  // When form is valid, update the step validation
  useEffect(() => {
    setStepValidation("hubInfoValid", formState.isValid);
  }, [formState.isValid, setStepValidation]);

  // Update store when form values change
  const onSubmit = (data: HubFormValues) => {
    setHubInfo(data);
  };

  // Convert JavaScript Date to CalendarDate for DatePicker
  const todayDate = today(getLocalTimeZone());

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                placeholder="My Hub"
                isRequired
                errorMessage={fieldState.error?.message}
                className={{
                  primitive: "flex-1 w-full",
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="color"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mt-6.5">
                <CustomColorPicker
                  selectedKey={value}
                  onSelectionChange={onChange}
                />
              </div>
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

        <div className="flex flex-col sm:flex-row gap-4">
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Start Date"
                isRequired
                className={{
                  primitive: "flex-1",
                }}
                overlayProps={{
                  visibleDuration: {
                    weeks: 6,
                  },
                }}
                value={
                  value
                    ? new CalendarDate(
                        value.getFullYear(),
                        value.getMonth() + 1,
                        value.getDate(),
                      )
                    : todayDate
                }
                onChange={(date) => {
                  if (date) {
                    const jsDate = new Date(
                      date.year,
                      date.month - 1,
                      date.day,
                    );
                    onChange(jsDate);
                  }
                }}
              />
            )}
          />
          {hasEndDate && (
            <Controller
              name="endDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="End Date"
                  className={{
                    primitive: "flex-1",
                  }}
                  value={
                    value
                      ? new CalendarDate(
                          value.getFullYear(),
                          value.getMonth() + 1,
                          value.getDate(),
                        )
                      : undefined
                  }
                  onChange={(date) => {
                    if (date) {
                      const jsDate = new Date(
                        date.year,
                        date.month - 1,
                        date.day,
                      );
                      onChange(jsDate);
                    } else {
                      onChange(null);
                    }
                  }}
                />
              )}
            />
          )}
        </div>

        <Controller
          name="hasEndDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch isSelected={value} onChange={onChange}>
              Has end date
            </Switch>
          )}
        />
      </div>
    </Form>
  );
}
