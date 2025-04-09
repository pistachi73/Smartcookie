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
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useAddSessions } from "../../hooks/session/use-add-sessions";
import { useHubById } from "../../hooks/use-hub-by-id";
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

  const { mutate: addSessions, isPending } = useAddSessions({
    onSuccess: () => {
      handleOpenChange(false);
    },
  });

  const onSubmit = (data: z.infer<typeof SessionFormSchema>) => {
    const serializedData = {
      date: serializeDateValue(data.date),
      startTime: serializeTime(data.startTime),
      endTime: serializeTime(data.endTime),
      rrule: data.rrule,
    };

    addSessions({
      formData: serializedData,
      hubEndsOn: hub.endDate,
      hubStartsOn: hub.startDate,
      hubId,
    });
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
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close size="small">Cancel</Modal.Close>
          <Button type="submit" shape="square" size="small" className="px-6">
            {isPending && (
              <ProgressCircle isIndeterminate aria-label="Adding session..." />
            )}
            Add Session
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
