"use client";

import { Button, Form, Menu, ProgressCircle, Sheet } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  CalendarAdd02Icon,
  CalendarSetting02Icon,
} from "@hugeicons/react";
import { useCallback, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { DiscardChangesModalContent } from "../components/discard-changes-modal-content";
import { EventOccurrenceForm } from "./form";
import { OccurrenceFormSchema, serializeOcurrenceFormData } from "./schema";
import { defaultformData } from "./utils";

const isValidFiniteNumber = (input: unknown): boolean =>
  typeof input === "number" && Number.isFinite(input);

export const EventOccurrenceFormSheet = () => {
  console.log("----EventOccurrenceFormSheet---");
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const { removeOccurrences, editedOccurrenceId, setEdittedOccurrenceId } =
    useCalendarStore(
      useShallow((store) => ({
        editedOccurrenceId: store.editedOccurrenceId,
        setEdittedOccurrenceId: store.setEdittedOccurrenceId,
        removeOccurrences: store.removeOccurrences,
      })),
    );

  // const { createEvent, editNonRecurrentEvent, isFormDisabled } =
  //   useSubmitOccurrenceForm();

  const form = useForm<z.infer<typeof OccurrenceFormSchema>>({
    defaultValues: defaultformData,
    resolver: zodResolver(OccurrenceFormSchema),
  });

  const closeEditSidebar = useCallback(() => {
    setIsDiscardModalOpen(false);
    setEdittedOccurrenceId(undefined);
    removeOccurrences(-1, { silent: true });
    form.reset(defaultformData);
    window.history.pushState(null, "", "/calendar");
  }, [form.reset, removeOccurrences, setEdittedOccurrenceId]);

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
  const isEdittingEvent = isValidFiniteNumber(editedOccurrenceId);

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
              <CalendarAdd02Icon />
            ) : (
              <CalendarSetting02Icon
                variant="duotone"
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
              Create Event <ArrowRight02Icon size={14} data-slot="icon" />
            </Button>
          ) : recurrenceRule ? (
            <Menu>
              <Menu.Trigger
                size="small"
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
                    <ArrowDown01Icon
                      size={14}
                      data-slot="icon"
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
