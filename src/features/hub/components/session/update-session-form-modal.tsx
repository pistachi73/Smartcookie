import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, Time } from "@internationalized/date";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";

import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useUpdateSession } from "../../hooks/session/use-update-session";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
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

  const { data: hub } = useHubById(hubId);

  const {
    mutateAsync: checkSessionConflicts,
    reset: resetConflicts,
    data: conflictsData,
    isPending: isCheckingConflicts,
  } = useCheckSessionConflicts();

  const { mutateAsync: updateSession, isPending: isUpdatingSession } =
    useUpdateSession();

  const form = useForm<z.infer<typeof UpdateSessionFormSchema>>({
    resolver: zodResolver(UpdateSessionFormSchema),
  });

  const isDirty = form.formState.isDirty;

  // Watch all changes
  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === "change") {
        resetConflicts();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, resetConflicts]);

  useEffect(() => {
    if (!hub) return;

    const startDate = new Date(session.startTime);
    const endDate = new Date(session.endTime);

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
  }, [form, session, hub]);

  const onSubmit = async (data: z.infer<typeof UpdateSessionFormSchema>) => {
    if (!hub) return;

    console.log({
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
    });
    const sessions = calculateRecurrentSessions({
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      hubStartsOn: hub.startDate,
    });

    const { success } = await checkSessionConflicts({
      sessions,
      excludedSessionIds: [session.id],
    });

    const sessionToUpdate = sessions[0];

    if (!success || !sessionToUpdate) return;

    console.log({
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      sessionToUpdateStartTime: sessionToUpdate.startTime,
      sessionToUpdateEndTime: sessionToUpdate.endTime,
    });
    await updateSession({
      sessionId: session.id,
      hubId,
      data: {
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
            <Modal.Footer>
              <Modal.Close size="small">Close</Modal.Close>
              <Button
                type="submit"
                shape="square"
                size="small"
                className="px-6"
                isPending={isPending}
                isDisabled={!isDirty || !hub}
              >
                {isPending && (
                  <ProgressCircle
                    isIndeterminate
                    aria-label="Editing session..."
                  />
                )}
                {isPending ? "Editing..." : "Edit"}
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
