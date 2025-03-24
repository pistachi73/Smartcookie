"use client";

import { useDeviceType } from "@/shared/components/layout/device-only/device-only-provider";
import { Button } from "@/shared/components/ui/button";
import { CustomColorPicker } from "@/shared/components/ui/custom-color-picker";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ParticipantsCombobox } from "@/shared/components/ui/participants-combobox";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Switch } from "@/shared/components/ui/switch";
import { TextField } from "@/shared/components/ui/text-field";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateHub } from "../hooks/use-create-hub";
import {
  type HubFormValues,
  defaultFormData,
  hubFormSchema,
} from "../lib/schemas";

interface CreateHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHub?: (values: HubFormValues) => Promise<void>;
}

export function CreateHubModal({
  isOpen,
  onClose,
  onCreateHub,
}: CreateHubModalProps) {
  const { isMobile } = useDeviceType();
  const { control, handleSubmit, watch } = useForm<HubFormValues>({
    resolver: zodResolver(hubFormSchema),
    defaultValues: defaultFormData,
  });

  const { mutate: createHub, isPending: isCreatingHub } = useCreateHub({
    onSuccess: () => {
      onClose();
      toast.success("Hub created successfully");
    },
  });

  const hasEndDate = watch("hasEndDate");

  const onSubmit = useCallback(
    async (data: HubFormValues) => {
      console.log("data", data);
      createHub({ formData: data });
    },
    [createHub],
  );

  // Convert JavaScript Date to CalendarDate for DatePicker
  const todayDate = today(getLocalTimeZone());

  return (
    <Modal.Content
      isBlurred
      isOpen={isOpen}
      onOpenChange={onClose}
      aria-labelledby="create-hub-title"
    >
      <Modal.Header>
        <Modal.Title id="create-hub-title">Create New Hub</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-4">
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

          <Controller
            name="participantIds"
            control={control}
            render={({ field }) => (
              <ParticipantsCombobox
                value={field.value}
                onChange={field.onChange}
                withIcon
                className={{ primitive: "w-full" }}
              />
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={isMobile ? "small" : "medium"}
            shape="square"
            appearance="outline"
            type="button"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            size={isMobile ? "small" : "medium"}
            shape="square"
            intent="primary"
            type="submit"
            isDisabled={isCreatingHub}
          >
            {isCreatingHub && (
              <ProgressCircle isIndeterminate aria-label="Creating..." />
            )}
            {isCreatingHub ? "Creating..." : "Create Hub"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
}
