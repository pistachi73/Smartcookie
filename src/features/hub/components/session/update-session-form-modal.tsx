import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, Time } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";

import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useUpdateSession } from "../../hooks/session/use-update-session";
import { getHubByIdQueryOptions } from "../../lib/hub-query-options";
import type { HubSession } from "../../types/hub.types";
import {
  SessionConflictModalContent,
  SessionConflictWarning,
} from "./session-conflict-modal-content";
import {
  UpdateSessionFormSchema,
  UpdateSessionsForm,
} from "./update-session-form";

type UpdateSessionFormModalProps = {
  hubId: number;
  session: HubSession;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const UpdateSessionFormModal = ({
  session,
  hubId,
  isOpen,
  setIsOpen,
}: UpdateSessionFormModalProps) => {
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const { data: hub } = useQuery({
    ...getHubByIdQueryOptions(hubId),
    enabled: isOpen,
  });

  const {
    mutateAsync: checkSessionConflicts,
    reset: resetConflicts,
    data: conflictsData,
    isPending: isCheckingConflicts,
  } = useCheckSessionConflicts();

  const { mutate: updateSession, isPending: isUpdatingSession } =
    useUpdateSession();

  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);

  const form = useForm<z.infer<typeof UpdateSessionFormSchema>>({
    resolver: zodResolver(UpdateSessionFormSchema),
    defaultValues: {
      date: new CalendarDate(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ),
      startTime: new Time(startDate.getHours(), startDate.getMinutes()),
      endTime: new Time(endDate.getHours(), endDate.getMinutes()),
      status: session.status,
    },
  });

  useEffect(() => {
    form.reset({
      date: new CalendarDate(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ),
      startTime: new Time(startDate.getHours(), startDate.getMinutes()),
      endTime: new Time(endDate.getHours(), endDate.getMinutes()),
      status: session.status,
    });
  }, [session]);

  const isDirty = form.formState.isDirty;

  // Watch all changes
  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type === "change") {
        resetConflicts();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, resetConflicts]);

  const onSubmit = async (data: z.infer<typeof UpdateSessionFormSchema>) => {
    const firtyField = form.formState.dirtyFields;
    const hasUpdatedTime = firtyField.startTime || firtyField.endTime;

    const startDate = new Date(
      data.date.year,
      data.date.month - 1,
      data.date.day,
      data.startTime.hour,
      data.startTime.minute,
    );

    const endDate = new Date(
      data.date.year,
      data.date.month - 1,
      data.date.day,
      data.endTime.hour,
      data.endTime.minute,
    );

    const sessionToUpdate = {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      hub: {
        id: hubId,
        name: hub?.name,
        color: hub?.color,
      },
    };

    if (!conflictsData && hasUpdatedTime) {
      const { success } = await checkSessionConflicts({
        sessions: [sessionToUpdate],
        excludedSessionIds: [session.id],
      });
      if (!success) return;
    }

    updateSession({
      sessionId: session.id,
      hubId,
      data: {
        originalStartTime: session.startTime,
        startTime: sessionToUpdate.startTime,
        endTime: sessionToUpdate.endTime,
        status: data.status,
      },
    });

    handleOpenChange(false);
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setTimeout(() => {
          resetConflicts();
          form.reset();
        }, 200);
      }
    },
    [resetConflicts, form, setIsOpen],
  );

  const isPending = isCheckingConflicts || isUpdatingSession;
  const hasConflicts = conflictsData && !conflictsData?.success;

  const buttonText = isPending
    ? "Saving..."
    : hasConflicts
      ? "Save with conflicts"
      : "Save";

  return (
    <>
      <Modal.Content size="md" isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Header
          title="Edit Session"
          description="Update the date, time, and status of the session."
        />
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal.Body className="pb-1 space-y-4">
              <UpdateSessionsForm
                minDate={hub?.startDate}
                maxDate={hub?.endDate}
              />

              {conflictsData && !conflictsData?.success && (
                <SessionConflictWarning
                  setIsConflictModalOpen={setIsConflictModalOpen}
                />
              )}
            </Modal.Body>
            <Modal.Footer className="flex flex-row">
              <Modal.Close size="sm" className={"w-full sm:w-fit"}>
                Close
              </Modal.Close>
              <Button
                type="submit"
                size="sm"
                className="px-6 w-full sm:w-fit"
                isPending={isPending}
                isDisabled={!isDirty || !hub}
              >
                {isPending && (
                  <ProgressCircle
                    isIndeterminate
                    aria-label="Editing session..."
                  />
                )}
                {buttonText}
              </Button>
            </Modal.Footer>
          </Form>
        </FormProvider>
      </Modal.Content>

      <SessionConflictModalContent
        isConflictModalOpen={isConflictModalOpen}
        setIsConflictModalOpen={setIsConflictModalOpen}
        conflictsData={conflictsData}
      />
    </>
  );
};
