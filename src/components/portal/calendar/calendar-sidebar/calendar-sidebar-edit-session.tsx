"use client";

import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { SessionOccurrenceFrom } from "../components/session-ocurrence-form";
import type { SessionOcurrenceFormSchema } from "../components/session-ocurrence-form/schema";

const useCalendarSidebarEditSession = () =>
  useCalendarStore(
    useShallow((store) => ({
      setActiveSidebar: store.setActiveSidebar,
    })),
  );

export const CalendarSidebarEditSession = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchparams = useSearchParams();
  const { setActiveSidebar } = useCalendarSidebarEditSession();

  const form = useForm<z.infer<typeof SessionOcurrenceFormSchema>>();

  useOnClickOutside(sidebarRef as any, () => {
    console.log("clicked outside");
    const { formState } = form;
    const { dirtyFields, isDirty } = formState;

    console.log({ dirtyFields, isDirty });
    form.formState.isDirty ? toast.info("Changes not saved") : null;
    window.history.pushState(null, "", "/calendar");
    setActiveSidebar("main");
  });

  useEffect(() => {
    console.log(form.formState);
  }, [form]);

  return (
    <div ref={sidebarRef} className="h-full w-full">
      <SessionOccurrenceFrom form={form} />
    </div>
  );
};
