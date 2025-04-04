import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { SessionFormSchema } from "../../lib/schemas";
import { SessionForm } from "./session-form";

type SessionFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const SessionFormModal = ({
  isOpen,
  onOpenChange,
}: SessionFormModalProps) => {
  const form = useForm<z.infer<typeof SessionFormSchema>>({
    resolver: zodResolver(SessionFormSchema),
    defaultValues: {
      date: today(getLocalTimeZone()),
      startTime: undefined,
      endTime: undefined,
      rrule: undefined,
    },
  });

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
      <Form>
        <Modal.Body>
          <SessionForm form={form} />
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
