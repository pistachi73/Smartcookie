import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Time, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useAddSessions } from "../../hooks/session/use-add-sessions";
import { useHubById } from "../../hooks/use-hub-by-id";
import { calculateRecurrentSessions } from "../../lib/calculate-recurrent-sessions";
import { SessionFormSchema } from "../../lib/schemas";
import { SessionForm } from "./session-form";

type SessionFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  hubId: number;
};

export const SessionFormModal = ({
  isOpen,
  onOpenChange,
  hubId,
}: SessionFormModalProps) => {
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

  const { mutateAsync: addSessions, data, isPending } = useAddSessions();

  const onSubmit = async (data: z.infer<typeof SessionFormSchema>) => {
    const sessions = calculateRecurrentSessions({
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      rruleStr: data.rrule,
      hubEndsOn: hub.endDate,
      hubStartsOn: hub.startDate,
    });

    const res = await addSessions({
      sessions,
      hubId,
      userId: "1",
    });

    // if (res.success) {
    //   handleOpenChange(false);
    // }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        form.reset();
      }, 200);
    }
  };

  const showRecurrenceWarning = recurrence && !hub.endDate;

  return (
    <>
      <Modal.Content size="md" isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Header
          title="Add Session"
          description="Add a session and notes to track your progress."
        />
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Modal.Body className="pb-1">
            <SessionForm
              form={form}
              minDate={hub?.startDate}
              maxDate={hub?.endDate}
            />

            {showRecurrenceWarning && (
              <div className="flex items-start gap-2 p-3 mt-4 text-sm bg-warning/20 border border-warning rounded-md">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={20}
                  className="shrink-0 text-warning-fg/80"
                />
                <div className="space-y-1">
                  <p className="font-medium text-warning-fg/80">
                    Recurrence limitation
                  </p>
                  <p className="text-sm text-warning-fg/80">
                    Since this hub doesn't have an end date, recurring sessions
                    will be calculated for a maximum of 6 months from the start
                    date.
                  </p>
                </div>
              </div>
            )}
            {data && !data?.success && data?.overlappingSessions && (
              <div className="flex items-start gap-2 p-3 mt-4 text-sm bg-danger/20 border border-danger rounded-md">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={20}
                  className="shrink-0 text-danger/80"
                />
                <div className="space-y-1">
                  <p className="font-medium text-danger/80">
                    Session time conflict detected
                  </p>
                  <Button
                    appearance="plain"
                    size="small"
                    className="mt-1 text-danger/80 hover:text-danger"
                    onPress={() => setIsConflictModalOpen(true)}
                  >
                    View conflicts
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close size="small">Cancel</Modal.Close>
            <Button type="submit" shape="square" size="small" className="px-6">
              {isPending && (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Adding session..."
                />
              )}
              Add Session
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>

      <Modal.Content
        size="md"
        isOpen={isConflictModalOpen}
        onOpenChange={setIsConflictModalOpen}
      >
        <Modal.Header
          title="Session Conflicts"
          description="The following sessions overlap with your scheduled time"
        />
        <Modal.Body>
          {data?.overlappingSessions?.map((conflictPair, index) => (
            <div key={index} className="p-3 border rounded-md mb-2">
              <p className="font-medium">
                {new Date(conflictPair.s1.startTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(conflictPair.s1.startTime).toLocaleTimeString()} -{" "}
                {new Date(conflictPair.s1.endTime).toLocaleTimeString()}
              </p>
              {conflictPair.s1.hubName && (
                <p className="mt-1">{conflictPair.s1.hubName}</p>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="outline"
            size="small"
            onPress={() => setIsConflictModalOpen(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </>
  );
};
