import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, Time, today } from "@internationalized/date";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";

import { useCheckSessionConflicts } from "@/features/hub/hooks/session/use-check-session-conflicts";
import { calculateRecurrentSessions } from "@/features/hub/lib/calculate-recurrent-sessions";
import { useHubFormStore } from "@/features/hub/store/hub-form-store";
import {
  AddSessionFormSchema,
  AddSessionsForm,
} from "../../session/add-sessions-form";
import {
  SessionConflictModalContent,
  SessionConflictWarning,
} from "../../session/session-conflict-modal-content";

type SessionModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SessionModal = ({ isOpen, onOpenChange }: SessionModalProps) => {
  const hubInfo = useHubFormStore((state) => state.hubInfo);
  const addSessions = useHubFormStore((state) => state.addSessions);

  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

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

  const {
    mutateAsync: checkSessionConflicts,
    reset: resetConflicts,
    data: conflictsData,
    isPending: isCheckingConflicts,
  } = useCheckSessionConflicts();

  const onSubmit = async (data: z.infer<typeof AddSessionFormSchema>) => {
    console.log({ data });
    const sessions = calculateRecurrentSessions({
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      rruleStr: data.rrule,
      hubEndsOn: hubInfo.endDate?.toString(),
      hubStartsOn: hubInfo.startDate
        ? hubInfo.startDate.toString()
        : today(getLocalTimeZone()).toString(),
    });

    const { success } = await checkSessionConflicts({
      sessions,
    });

    if (!success) return;
    if (!sessions.length) {
      toast.error("No sessions to add");
      return;
    }

    addSessions(sessions);

    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        resetConflicts();
        form.reset();
      }, 200);
    }
  };

  const showRecurrenceWarning = recurrence && !hubInfo.endDate;

  return (
    <>
      <Modal.Content
        size="md"
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        isDismissable={false}
      >
        <Modal.Header
          title="Add Session"
          description="Add a session and notes to track your progress."
        />
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal.Body className="pb-1 space-y-4">
              <AddSessionsForm
                minDate={hubInfo.startDate?.toString()}
                maxDate={hubInfo.endDate?.toString()}
                removeHubSelection
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
              <Modal.Close size="sm">Cancel</Modal.Close>
              <Button
                type="submit"
                size="sm"
                className="px-6"
                isPending={isCheckingConflicts}
              >
                Add Session
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
