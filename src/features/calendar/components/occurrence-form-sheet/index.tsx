"use client";

import { cn } from "@/shared/lib/classes";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { Menu } from "@/ui/menu";
import { ProgressCircle } from "@/ui/progress-circle";
import { Sheet } from "@/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  CalendarAdd02Icon,
  CalendarSetting02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import {
  OccurrenceFormSchema,
  serializeOcurrenceFormData,
} from "../../types/occurrence-form-schema";
import { DiscardChangesModalContent } from "../discard-changes-modal-content";
import { EventOccurrenceForm } from "./form";
import { defaultformData } from "./utils";

const isValidFiniteNumber = (input: unknown): boolean =>
  typeof input === "number" && Number.isFinite(input);

export const EventOccurrenceFormSheet = () => {
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  // const { createEvent, editNonRecurrentEvent, isFormDisabled } =
  //   useSubmitOccurrenceForm();

  const form = useForm<z.infer<typeof OccurrenceFormSchema>>({
    defaultValues: defaultformData,
    resolver: zodResolver(OccurrenceFormSchema),
  });

  const closeEditSidebar = useCallback(() => {
    setIsDiscardModalOpen(false);
    // setEdittedOccurrenceId(undefined);
    // removeOccurrences(-1, { silent: true });
    form.reset(defaultformData);
    window.history.pushState(null, "", "/calendar");
  }, [form.reset]);

  const onClose = useCallback(() => {
    const isDirty = form.formState.isDirty;
    if (isDirty) setIsDiscardModalOpen(true);
    else {
      closeEditSidebar();
    }
  }, [form, closeEditSidebar]);

  const isFormDisabled = false;

  const onSubmit = (
    formData: z.infer<typeof OccurrenceFormSchema>,
    mode:
      | "create"
      | "edit-non-recurrent"
      | "edit-recurrent-current"
      | "edit-recurrent-all"
      | "edit-recurrent-posterior",
  ) => {
    const serializedFormData = serializeOcurrenceFormData(formData);

    // switch (mode) {
    //   case "create": {
    //     createEvent({ formData: serializedFormData });
    //     break;
    //   }
    //   case "edit-non-recurrent": {
    //     // const eventId =
    //     //   eventOccurrences[editingEventOccurrenceId ?? -1]?.eventId;

    //     // if (!editingEventOccurrenceId || !eventId) {
    //     //   toast.error("Event occurrence not found");
    //     //   return;
    //     // }

    //     const filteredFormData = pickKeysByFilter(
    //       serializedFormData,
    //       form.formState.dirtyFields as Record<string, boolean>,
    //     );

    //     // editNonRecurrentEvent({
    //     //   occurrenceId: editingEventOccurrenceId,
    //     //   formData: filteredFormData,
    //     //   eventId,
    //     // });

    //     break;
    //   }
    // }

    // form.reset(defaultformData);s
  };

  const recurrenceRule = useWatch({
    control: form.control,
    name: "recurrenceRule",
  });
  const isEdittingEvent = false;
  const editedOccurrenceId = -1;

  return (
    <>
      <Sheet.Content
        isOpen={isEdittingEvent}
        onOpenChange={onClose}
        side="left"
        classNames={{ content: "w-[360px]!", overlay: "bg-transparent " }}
      >
        <Sheet.Header className="sticky top-0 flex flex-row items-center gap-x-3 border-b bg-overlay p-4">
          <Sheet.Title className="gap-2">
            {editedOccurrenceId === -1 ? (
              <HugeiconsIcon icon={CalendarAdd02Icon} />
            ) : (
              <HugeiconsIcon
                icon={CalendarSetting02Icon}
                color="var(--color-primary)"
              />
            )}{" "}
            {editedOccurrenceId === -1 ? "Create" : "Edit"} Session
          </Sheet.Title>
        </Sheet.Header>
        <Sheet.Body className="p-4!">
          <FormProvider {...form}>
            <Form id="event-occurrence-form">
              <EventOccurrenceForm form={form} isDisabled={isFormDisabled} />
            </Form>
          </FormProvider>
        </Sheet.Body>
        <Sheet.Footer className="sticky bottom-0 border-t flex items-center justify-end gap-2 p-4!">
          <Button
            appearance="plain"
            size="small"
            onPress={onClose}
            isDisabled={isFormDisabled}
          >
            Cancel
          </Button>

          {editedOccurrenceId === -1 ? (
            <Button
              size="small"
              className="px-6"
              form="event-occurrence-form"
              onPress={() => {
                form.handleSubmit((d) => onSubmit(d, "create"))();
              }}
              isDisabled={isFormDisabled}
            >
              {isFormDisabled && (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Creating event..."
                />
              )}
              Create Event <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </Button>
          ) : recurrenceRule ? (
            <Menu>
              <Menu.Trigger
                className="px-6"
                form="event-occurrence-form"
                isDisabled={isFormDisabled}
              >
                {({ isPressed }) => (
                  <>
                    {isFormDisabled && (
                      <ProgressCircle
                        isIndeterminate
                        aria-label="Creating event..."
                      />
                    )}
                    Save
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={14}
                      className={cn(isPressed ? "rotate-180" : "text-fg")}
                    />
                  </>
                )}
              </Menu.Trigger>
              <Menu.Content placement="right bottom">
                <Menu.Item>This Event</Menu.Item>
                <Menu.Item>This and the following events</Menu.Item>
                <Menu.Item>All events</Menu.Item>
              </Menu.Content>
            </Menu>
          ) : (
            <Button
              size="small"
              className="px-6"
              form="event-occurrence-form"
              onPress={() => {
                form.handleSubmit((d) => onSubmit(d, "edit-non-recurrent"))();
              }}
              isDisabled={isFormDisabled}
            >
              {isFormDisabled && (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Creating event..."
                />
              )}
              Save
            </Button>
          )}
        </Sheet.Footer>
        {/* </Form> */}
      </Sheet.Content>

      <DiscardChangesModalContent
        isOpen={isDiscardModalOpen}
        onOpenChange={setIsDiscardModalOpen}
        onDiscardChanges={closeEditSidebar}
      />
    </>
  );
};
