import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time, getLocalTimeZone, today } from "@internationalized/date";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useAddSessions } from "../../hooks/session/use-add-sessions";
import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
import { useSessionStore } from "../../store/session-store";
import { AddSessionFormSchema, AddSessionsForm } from "./add-sessions-form";
import {
  SessionConflictModalContent,
  SessionConflictWarning,
} from "./session-conflict-modal-content";

type AddSessionsFormModalProps = {
  hubId: number;
};

export const AddSessionsFormModal = ({ hubId }: AddSessionsFormModalProps) => {
  const isAddModalOpen = useSessionStore((state) => state.isAddModalOpen);
  const setIsAddModalOpen = useSessionStore((state) => state.setIsAddModalOpen);
  const { data: hub } = useHubById(hubId);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  if (!hub) {
    return null;
  }

  const form = useForm<z.infer<typeof AddSessionFormSchema>>({
    resolver: zodResolver(AddSessionFormSchema),
    defaultValues: {
      date: today(getLocalTimeZone()),
      startTime: new Time(12, 30, 0),
      endTime: new Time(14, 30, 0),
      rrule: undefined,
    },
  });

  const [recurrence] = useWatch({
    control: form.control,
    name: ["rrule"],
  });

  // Watch all changes
  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === "change") {
        resetConflicts();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const { mutateAsync: addSessions, isPending: isAddingSessions } =
    useAddSessions();
  const {
    mutateAsync: checkSessionConflicts,
    reset: resetConflicts,
    data: conflictsData,
    isPending: isCheckingConflicts,
  } = useCheckSessionConflicts();

  const onSubmit = async (data: z.infer<typeof AddSessionFormSchema>) => {
    const sessions = calculateRecurrentSessions({
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      rruleStr: data.rrule,
      hubEndsOn: hub.endDate,
      hubStartsOn: hub.startDate,
    });

    const { success } = await checkSessionConflicts({
      sessions,
    });

    if (!success) return;
    if (!sessions.length) {
      toast.error("No sessions to add");
      return;
    }

    await addSessions({
      hubId,
      sessions,
    });

    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsAddModalOpen(open);
    if (!open) {
      setTimeout(() => {
        resetConflicts();
        form.reset();
      }, 200);
    }
  };

  const showRecurrenceWarning = recurrence && !hub.endDate;

  return (
    <>
      <Modal.Content
        size="md"
        isOpen={isAddModalOpen}
        onOpenChange={handleOpenChange}
      >
        <Modal.Header
          title="Add Session"
          description="Add a session and notes to track your progress."
        />
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal.Body className="pb-1 space-y-4">
              <AddSessionsForm
                minDate={hub?.startDate}
                maxDate={hub?.endDate}
              />

              {showRecurrenceWarning && (
                <Note intent="warning">
                  <div className="space-y-1">
                    <p className="font-medium">Recurrence limitation</p>
                    <p className="text-sm opacity-80">
                      Since this hub doesn't have an end date, recurring
                      sessions will be calculated for a maximum of 6 months from
                      the start date.
                    </p>
                  </div>
                </Note>
              )}
              {conflictsData && !conflictsData?.success && (
                <SessionConflictWarning
                  setIsConflictModalOpen={setIsConflictModalOpen}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close size="small" isDisabled={isAddingSessions}>
                Cancel
              </Modal.Close>
              <Button
                type="submit"
                shape="square"
                size="small"
                className="px-6"
                isPending={isAddingSessions || isCheckingConflicts}
              >
                {(isAddingSessions || isCheckingConflicts) && (
                  <ProgressCircle
                    isIndeterminate
                    aria-label="Adding session..."
                  />
                )}
                {isCheckingConflicts || isAddingSessions
                  ? "Adding session..."
                  : "Add Session"}
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
