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
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";

import { useAddSessions } from "../../hooks/session/use-add-sessions";
import { useCheckSessionConflicts } from "../../hooks/session/use-check-session-conflicts";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
import { AddSessionFormSchema, AddSessionsForm } from "./add-sessions-form";
import {
  SessionConflictModalContent,
  SessionConflictWarning,
} from "./session-conflict-modal-content";

type AddSessionsFormModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hubId?: number;
  disableHubSelection?: boolean;
  defaultValues?: Partial<z.infer<typeof AddSessionFormSchema>>;
};

export const AddSessionsFormModal = ({
  isOpen,
  onOpenChange,
  hubId,
  disableHubSelection,
  defaultValues,
}: AddSessionsFormModalProps) => {
  console.log("defaultValues", defaultValues);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const form = useForm<z.infer<typeof AddSessionFormSchema>>({
    resolver: zodResolver(AddSessionFormSchema),
    defaultValues: defaultValues ?? {
      hubId: hubId,
      date: today(getLocalTimeZone()),
      startTime: new Time(12, 30, 0),
      endTime: new Time(14, 30, 0),
      rrule: undefined,
    },
  });

  const [recurrence, selectedHubId] = useWatch({
    control: form.control,
    name: ["rrule", "hubId"],
  });

  const { data: hub } = useHubById(selectedHubId);

  // Watch all changes
  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === "change") {
        resetConflicts();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const { mutateAsync: addSessions, isPending: isAddingSessions } =
    useAddSessions();
  const {
    mutateAsync: checkSessionConflicts,
    reset: resetConflicts,
    data: conflictsData,
    isPending: isCheckingConflicts,
  } = useCheckSessionConflicts();

  const onSubmit = async (data: z.infer<typeof AddSessionFormSchema>) => {
    if (!hub) {
      return;
    }

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
      hubId: data.hubId,
      sessions,
    });

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

  const showRecurrenceWarning = recurrence && !hub?.endDate;

  return (
    <>
      <Modal.Content size="md" isOpen={isOpen} onOpenChange={handleOpenChange}>
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
                disableHubSelection={disableHubSelection}
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
