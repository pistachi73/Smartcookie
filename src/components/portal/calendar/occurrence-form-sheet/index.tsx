"use client";

import {
  Button,
  Form,
  Menu,
  ProgressCircle,
  Sheet,
} from "@/components/ui/new/ui";
import { cn, pickKeysByFilter } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  CalendarAdd02Icon,
  CalendarSetting02Icon,
} from "@hugeicons/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { DiscardChangesModalContent } from "../components/discard-changes-modal-content";
import { EventOccurrenceForm } from "./form";
import { OccurrenceFormSchema, serializeOcurrenceFormData } from "./schema";
import { useEventFormOverrides } from "./use-event-form-overrides";
import { useSubmitOccurrenceForm } from "./use-submit-occurrence-form";
import { defaultformData } from "./utils";

const useCalendarSidebarEditSession = () =>
  useCalendarStore(
    useShallow((store) => ({
      activeSidebar: store.activeSidebar,
      eventOccurrences: store.eventOccurrences,
      editingEventOccurrenceId: store.editingEventOccurrenceId,
      setActiveSidebar: store.setActiveSidebar,
      clearDraftEventOccurrence: store.clearDraftEventOccurrence,
      clearEditingEventOccurrence: store.clearEditingEventOccurrence,
    })),
  );

export const EventOccurrenceFormSheet = () => {
  const {
    setActiveSidebar,
    editingEventOccurrenceId,
    eventOccurrences,
    clearDraftEventOccurrence,
    clearEditingEventOccurrence,
    activeSidebar,
  } = useCalendarSidebarEditSession();

  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const form = useForm<z.infer<typeof OccurrenceFormSchema>>({
    defaultValues: defaultformData,
    resolver: zodResolver(OccurrenceFormSchema),
  });
  useEventFormOverrides(form);

  const { createEvent, editNonRecurrentEvent, isPending } =
    useSubmitOccurrenceForm();

  const closeEditSidebar = useCallback(() => {
    setIsDiscardModalOpen(false);
    clearEditingEventOccurrence();
    setActiveSidebar("main");
    clearDraftEventOccurrence();
    form.reset(defaultformData);
    window.history.pushState(null, "", "/calendar");
  }, [
    clearDraftEventOccurrence,
    form,
    clearEditingEventOccurrence,
    setActiveSidebar,
  ]);

  const onClose = useCallback(() => {
    const isDirty = form.formState.isDirty;
    if (isDirty) setIsDiscardModalOpen(true);
    else {
      closeEditSidebar();
    }
  }, [form, closeEditSidebar]);

  const isFormDisabled = isPending;

  const editingOccurrence = editingEventOccurrenceId
    ? eventOccurrences?.[editingEventOccurrenceId]
    : undefined;

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

    switch (mode) {
      case "create": {
        createEvent({ formData: serializedFormData });
        break;
      }
      case "edit-non-recurrent": {
        const eventId =
          eventOccurrences[editingEventOccurrenceId ?? -1]?.eventId;

        if (!editingEventOccurrenceId || !eventId) {
          toast.error("Event occurrence not found");
          return;
        }

        const filteredFormData = pickKeysByFilter(
          serializedFormData,
          form.formState.dirtyFields as Record<string, boolean>,
        );

        editNonRecurrentEvent({
          occurrenceId: editingEventOccurrenceId,
          formData: filteredFormData,
          eventId,
        });

        break;
      }
    }

    // form.reset(defaultformData);s
  };

  return (
    <>
      <Sheet.Content
        isOpen={activeSidebar === "edit-session"}
        onOpenChange={onClose}
        side="left"
        classNames={{ content: "w-[360px]!", overlay: "bg-transparent " }}
      >
        <Sheet.Header className="sticky top-0 flex flex-row items-center gap-x-3 border-b bg-overlay p-4">
          <Sheet.Title className="gap-2">
            {editingEventOccurrenceId === -1 ? (
              <CalendarAdd02Icon />
            ) : (
              <CalendarSetting02Icon
                variant="duotone"
                color="var(--color-primary)"
              />
            )}{" "}
            {editingEventOccurrenceId === -1 ? "Create" : "Edit"} Session
          </Sheet.Title>
        </Sheet.Header>
        <Sheet.Body className="p-4!">
          <Form id="event-occurrence-form">
            <EventOccurrenceForm form={form} isDisabled={isFormDisabled} />
          </Form>
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

          {editingEventOccurrenceId === -1 ? (
            <Button
              size="small"
              className="px-6"
              form="event-occurrence-form"
              onPress={() => {
                form.handleSubmit((d) => onSubmit(d, "create"))();
              }}
              isDisabled={isFormDisabled}
            >
              {isPending && (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Creating event..."
                />
              )}
              Create Event <ArrowRight02Icon size={14} data-slot="icon" />
            </Button>
          ) : editingOccurrence?.isRecurring ? (
            <Menu>
              <Menu.Trigger
                size="small"
                className="px-6"
                form="event-occurrence-form"
                isDisabled={isFormDisabled}
              >
                {({ isPressed }) => (
                  <>
                    {isPending && (
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
              {isPending && (
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
