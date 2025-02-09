"use client";

import {
  Button,
  Form,
  Modal,
  ProgressCircle,
  Sheet,
} from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarAdd02Icon, CalendarSetting02Icon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { DiscardChangesModalContent } from "../components/discard-changes-modal-content";
import { SessionOccurrenceFrom } from "../event-occurrence-form";
import { SessionOcurrenceFormSchema } from "../event-occurrence-form/schema";
import { useCreateEvent } from "../event-occurrence-form/use-create-event";
import { useEventFormOverrides } from "../event-occurrence-form/use-event-form-overrides";
import { defaultValues } from "../event-occurrence-form/utils";

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

export const CalendarSidebarEditSession = () => {
  const {
    setActiveSidebar,
    editingEventOccurrenceId,
    eventOccurrences,
    clearDraftEventOccurrence,
    clearEditingEventOccurrence,
    activeSidebar,
  } = useCalendarSidebarEditSession();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const form = useForm<z.infer<typeof SessionOcurrenceFormSchema>>({
    defaultValues,
    resolver: zodResolver(SessionOcurrenceFormSchema),
  });
  useEventFormOverrides(form);
  const { createEvent, isCreatingEvent } = useCreateEvent();

  const closeEditSidebar = useCallback(() => {
    clearEditingEventOccurrence();
    setActiveSidebar("main");
    clearDraftEventOccurrence();
    window.history.pushState(null, "", "/calendar");
  }, [
    clearDraftEventOccurrence,
    clearEditingEventOccurrence,
    setActiveSidebar,
  ]);

  const onCancel = useCallback(() => {
    const isDirty = form.formState.isDirty;
    if (isDirty) setIsDiscardModalOpen(true);
    else {
      closeEditSidebar();
    }
  }, [form, closeEditSidebar]);

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape") return;
        onCancel();
      },
      {
        signal: abortController.signal,
      },
    );

    return () => {
      abortController.abort();
    };
  }, [onCancel]);

  const isFormDisabled = isCreatingEvent;

  return (
    <>
      <Sheet.Content
        isOpen={activeSidebar === "edit-session"}
        side="left"
        classNames={{ content: "w-[378px]!" }}
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
        <Form>
          <Sheet.Body className="px-0 sm:px-0">
            {/* <CalendarSidebarEditSession /> */}
            <SessionOccurrenceFrom
              form={form}
              isDisabled={isFormDisabled}
              editingEventOccurrenceId={editingEventOccurrenceId}
              onCancel={onCancel}
            />
          </Sheet.Body>
          <Sheet.Footer className="sticky bottom-0  flex-row  gap-x-3 border-t bg-overlay flex items-center justify-end gap-2 p-4">
            <Button
              appearance="plain"
              size="small"
              onPress={onCancel}
              isDisabled={isFormDisabled}
            >
              Cancel
            </Button>

            <Button
              size="small"
              className="px-6"
              type="submit"
              isDisabled={isFormDisabled}
            >
              {isCreatingEvent && (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Creating event..."
                />
              )}
              Save
            </Button>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>

      <Modal isOpen={isDiscardModalOpen} onOpenChange={setIsDiscardModalOpen}>
        <DiscardChangesModalContent onDiscardChanges={closeEditSidebar} />
      </Modal>
    </>
  );
};
