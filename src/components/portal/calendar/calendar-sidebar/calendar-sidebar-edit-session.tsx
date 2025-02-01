"use client";

import { Modal } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, Time, getLocalTimeZone } from "@internationalized/date";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { DiscardChangesModalContent } from "../components/discard-changes-modal-content";
import { SessionOccurrenceFrom } from "../event-occurrence-form";
import { SessionOcurrenceFormSchema } from "../event-occurrence-form/schema";
import { consumeOccurrenceOverrides } from "../utils";

const useCalendarSidebarEditSession = () =>
  useCalendarStore(
    useShallow((store) => ({
      setActiveSidebar: store.setActiveSidebar,
      editingEventOccurrenceId: store.editingEventOccurrenceId,
      clearDraftEventOccurrence: store.clearDraftEventOccurrence,
      eventOccurrences: store.eventOccurrences,
      clearEditingEventOccurrence: store.clearEditingEventOccurrence,
    })),
  );

const defaultValues: Partial<z.infer<typeof SessionOcurrenceFormSchema>> = {
  hubId: undefined,
  title: "",
  description: "",
  date: undefined,
  startTime: undefined,
  endTime: undefined,
  timezone: getLocalTimeZone(),
  recurrenceRule: undefined,
  participants: [],
  isBillable: false,
  price: undefined,
};

export const CalendarSidebarEditSession = () => {
  const {
    setActiveSidebar,
    editingEventOccurrenceId,
    eventOccurrences,
    clearDraftEventOccurrence,
    clearEditingEventOccurrence,
  } = useCalendarSidebarEditSession();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof SessionOcurrenceFormSchema>>({
    defaultValues,
    resolver: zodResolver(SessionOcurrenceFormSchema),
  });

  useEffect(() => {
    if (!editingEventOccurrenceId) return;
    const eventOccurrence = eventOccurrences?.[editingEventOccurrenceId];

    if (!eventOccurrence) return;
    const { userId, startTime, endTime, isRecurring, recurrenceRule, ...rest } =
      eventOccurrence;

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    form.reset({
      ...defaultValues,
      date: new CalendarDate(
        startTimeDate.getFullYear(),
        startTimeDate.getMonth() + 1,
        startTimeDate.getDate(),
      ),
      startTime: new Time(startTimeDate.getHours(), startTimeDate.getMinutes()),
      endTime: new Time(endTimeDate.getHours(), endTimeDate.getMinutes()),
      recurrenceRule: recurrenceRule || undefined,
      ...rest,
    });
  }, [editingEventOccurrenceId, eventOccurrences, form.reset]);

  useEffect(() => {
    const overrides = consumeOccurrenceOverrides(searchParams);
    if (!overrides) return;
    const { date, startTime, endTime, timezone } = overrides;
    if (date) {
      form.setValue("date", date);
    }
    if (startTime) {
      form.setValue("startTime", startTime);
    }
    if (endTime) {
      form.setValue("endTime", endTime);
    }
    if (timezone) {
      form.setValue("timezone", timezone);
    }
  }, [searchParams, form.setValue]);

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
    const eventListener = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onCancel();
    };

    window.addEventListener("keydown", eventListener);

    return () => {
      window.removeEventListener("keydown", eventListener);
    };
  }, []);

  return (
    <>
      <SessionOccurrenceFrom
        form={form}
        editingEventOccurrenceId={editingEventOccurrenceId}
        onCancel={onCancel}
      />
      <Modal isOpen={isDiscardModalOpen} onOpenChange={setIsDiscardModalOpen}>
        <DiscardChangesModalContent onDiscardChanges={closeEditSidebar} />
      </Modal>
    </>
  );
};
