"use client";

import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarDate, Time } from "@internationalized/date";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { SessionOccurrenceFrom } from "../event-occurrence-form";
import type { SessionOcurrenceFormSchema } from "../event-occurrence-form/schema";

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

export const CalendarSidebarEditSession = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    setActiveSidebar,
    editingEventOccurrenceId,
    eventOccurrences,
    clearDraftEventOccurrence,
    clearEditingEventOccurrence,
  } = useCalendarSidebarEditSession();

  const form = useForm<z.infer<typeof SessionOcurrenceFormSchema>>();

  // useOnClickOutside(
  //   sidebarRef as any,
  //   () => {
  //     console.log("clicked outside", editingEventOccurrenceId);
  //     const { formState } = form;
  //     const { dirtyFields, isDirty } = formState;

  //     console.log({ dirtyFields, isDirty });

  //     form.formState.isDirty ? toast.info("Changes not saved") : null;
  //     form.reset();

  //     clearDraftEventOccurrence();
  //     clearEditingEventOccurrence();
  //     setActiveSidebar("main");
  //     window.history.pushState(null, "", "/calendar");
  //   },
  //   "mouseup",
  //   { passive: true },
  // );

  useEffect(() => {
    if (!editingEventOccurrenceId) return;
    const eventOccurrence = eventOccurrences?.[editingEventOccurrenceId];

    if (!eventOccurrence) return;
    const { userId, startTime, endTime, isRecurring, recurrenceRule, ...rest } =
      eventOccurrence;

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    form.reset({
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

  return (
    <div ref={sidebarRef} className="h-full w-full">
      <SessionOccurrenceFrom
        form={form}
        editingEventOccurrenceId={editingEventOccurrenceId || -1}
      />
    </div>
  );
};
