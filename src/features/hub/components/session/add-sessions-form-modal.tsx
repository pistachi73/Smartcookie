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
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useAddSessions } from "../../hooks/session/use-add-sessions";
import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
import { SessionFormSchema } from "../../lib/schemas";
import { useSessionStore } from "../../store/session-store";
import { AddSessionsForm } from "./add-sessions-form";
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

  const form = useForm<z.infer<typeof SessionFormSchema>>({
    resolver: zodResolver(SessionFormSchema),
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

  const onSubmit = async (data: z.infer<typeof SessionFormSchema>) => {
    const sessions = calculateRecurrentSessions({
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      rruleStr: data.rrule,
      hubEndsOn: hub.endDate,
      hubStartsOn: hub.startDate,
    });

    console.log({ sessions });

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
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Modal.Body className="pb-1 space-y-4">
            <AddSessionsForm
              form={form}
              minDate={hub?.startDate}
              maxDate={hub?.endDate}
            />

            {showRecurrenceWarning && (
              <Note intent="warning">
                <div className="space-y-1">
                  <p className="font-medium">Recurrence limitation</p>
                  <p className="text-sm opacity-80">
                    Since this hub doesn't have an end date, recurring sessions
                    will be calculated for a maximum of 6 months from the start
                    date.
                  </p>
                </div>
              </Note>
            )}
            {conflictsData && !conflictsData?.success && (
              <SessionConflictWarning
                setIsConflictModalOpen={setIsConflictModalOpen}
              />
              // <div className="flex items-center flex-wrap gap-2 p-3 mt-4 justify-between text-sm bg-danger/20 border border-danger rounded-md">
              //   <div className="flex items-center gap-2">
              //     <HugeiconsIcon
              //       icon={Alert02Icon}
              //       size={20}
              //       className="shrink-0 text-danger/80"
              //     />
              //     <p className="font-medium text-danger/80">
              //       Session time conflict detected
              //     </p>
              //   </div>
              //   {!!conflictsData?.overlappingSessions.length && (
              //     <Button
              //       appearance="outline"
              //       size="small"
              //       className="text-danger/80 hover:text-danger border-danger/50 bg-overlay/50 px-2 py-1"
              //       onPress={() => setIsConflictModalOpen(true)}
              //     >
              //       View conflicts
              //     </Button>
              //   )}
              // </div>
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
      </Modal.Content>

      <SessionConflictModalContent
        isConflictModalOpen={isConflictModalOpen}
        setIsConflictModalOpen={setIsConflictModalOpen}
        conflictsData={conflictsData}
      />
    </>
  );
};
