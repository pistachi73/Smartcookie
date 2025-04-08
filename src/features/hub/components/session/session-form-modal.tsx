import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time, getLocalTimeZone, today } from "@internationalized/date";
import { useForm } from "react-hook-form";
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

  const { mutate: addSessions } = useAddSessions();

  const onSubmit = (data: z.infer<typeof SessionFormSchema>) => {
    console.log({ data });

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

  return (
    <Modal.Content size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
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
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close size="small">Cancel</Modal.Close>
          <Button type="submit" shape="square" size="small" className="px-6">
            Add Session
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
