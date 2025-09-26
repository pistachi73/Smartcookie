"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderDetailsIcon } from "@hugeicons-pro/core-solid-rounded";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { CustomColorPicker } from "@/shared/components/ui/custom-color-picker";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label } from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/classes";

import { useCreateHub } from "../../hooks/use-create-hub";
import { defaultHubInfo, hubInfoSchema } from "../../lib/schemas";

export function CreateHubForm() {
  const { mutate: createHub, isPending } = useCreateHub();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof hubInfoSchema>>({
    resolver: zodResolver(hubInfoSchema),
    defaultValues: defaultHubInfo,
    mode: "onChange",
  });

  const startDate = useWatch({ control, name: "startDate" });

  const onSubmit = (data: z.infer<typeof hubInfoSchema>) => {
    createHub({
      hubInfo: {
        ...data,
        startDate: data.startDate?.toString(),
        endDate: data.endDate?.toString(),
      },
    });
  };

  return (
    <div className="h-full w-full bg-bg overflow-y-auto pt-12 pb-12 px-4">
      <div className="w-full bg-bg flex flex-col items-center max-w-3xl mx-auto gap-6">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-2 text-center max-w-2xl">
            <Heading
              level={1}
              tracking="tight"
              className="sm:text-2xl font-bold"
            >
              Create New Course
            </Heading>
            <p className="text-base text-muted-fg leading-relaxed max-w-[34ch]">
              Create your course with basic information. You can add students
              and sessions later.
            </p>
          </div>

          <Card className="w-full bg-overlay">
            <Card.Header className="flex flex-row items-center gap-3">
              <div className="size-12 rounded-xl bg-primary-tint flex items-center justify-center">
                <HugeiconsIcon
                  icon={FolderDetailsIcon}
                  size={18}
                  className="text-primary"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <Card.Title className="text-xl font-semibold">
                  Course Information
                </Card.Title>
                <Card.Description>
                  Let's start with the basic information about your course.
                </Card.Description>
              </div>
            </Card.Header>
            <Separator />
            <Card.Content>
              <Form
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
                        <div
                          className={cn(
                            Boolean(errors.name?.message) && "-mt-7.5",
                          )}
                        >
                          <CustomColorPicker
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

                <div className="flex flex-col sm:flex-row gap-4">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field: { onChange, value }, fieldState }) => (
                      <DatePicker
                        label="Start Date"
                        isRequired
                        className="flex-1"
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
                        className="flex-1"
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
                      placeholder="This course is for..."
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
                        errorMessage={fieldState.error?.message}
                        description="Optional schedule information"
                        className={{ primitive: "flex-1", fieldGroup: "h-10" }}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div
                  className="mb-0! h-20 w-full block sm:hidden"
                  aria-hidden="true"
                />
                <div
                  className={cn(
                    "flex flex-col fixed bottom-0 border-t left-0 bg-overlay p-4 w-full",
                    "sm:relative sm:p-0 sm:flex-row sm:justify-end sm:border-none",
                  )}
                >
                  <Button type="submit" className="px-6" isDisabled={isPending}>
                    {isPending ? "Creating Course..." : "Create Course"}
                    <HugeiconsIcon
                      icon={ArrowRight02Icon}
                      size={16}
                      data-slot="icon"
                    />
                  </Button>
                </div>
              </Form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
