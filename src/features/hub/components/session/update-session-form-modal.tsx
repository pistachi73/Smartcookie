import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, Time } from "@internationalized/date";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useUpdateSession } from "../../hooks/session/use-update-session";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
import { UpdateSessionFormSchema } from "../../lib/sessions.schema";
import type { HubSession } from "../../types/hub.types";
import {
  SessionConflictModalContent,
  SessionConflictWarning,
} from "./session-conflict-modal-content";
import { UpdateSessionsForm } from "./update-session-form";

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

  if (!hub) return null;

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
    form.reset({
      date: new CalendarDate(
        session.startTime.getFullYear(),
        session.startTime.getMonth() + 1,
        session.startTime.getDate(),
      ),
      startTime: new Time(
        session.startTime.getHours(),
        session.startTime.getMinutes(),
      ),
      endTime: new Time(
        session.endTime.getHours(),
        session.endTime.getMinutes(),
      ),
      status: session.status,
    });
  }, [form, session]);

  const onSubmit = async (data: z.infer<typeof UpdateSessionFormSchema>) => {
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
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Modal.Body className="pb-1 space-y-4">
            <UpdateSessionsForm
              form={form}
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
              isDisabled={!isDirty}
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
      </Modal.Content>

      <SessionConflictModalContent
        isConflictModalOpen={isConflictModalOpen}
        setIsConflictModalOpen={setIsConflictModalOpen}
        conflictsData={conflictsData}
      />
    </>
  );
};
