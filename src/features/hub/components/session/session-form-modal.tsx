import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { serializeDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializeTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
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
  const form = useForm<z.infer<typeof SessionFormSchema>>({
    resolver: zodResolver(SessionFormSchema),
    defaultValues: {
      date: today(getLocalTimeZone()),
      startTime: undefined,
      endTime: undefined,
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

    addSessions({ formData: serializedData, hubEndsOn: hub?.endDate });
  };

  return (
    <Modal.Content
      classNames={{
        content: "max-w-[400px]",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Modal.Header
        title="Add Session"
        description="Add a session and notes to track your progress."
      />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          <SessionForm
            form={form}
            minDate={hub?.startDate}
            maxDate={hub?.endDate}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" shape="square" size="small" onPress={() => {}}>
            Add Session
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
