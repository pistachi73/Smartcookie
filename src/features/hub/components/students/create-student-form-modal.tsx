import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateStudentInHub } from "../../hooks/students/use-create-student-in-hub";
import { useHubById } from "../../hooks/use-hub-by-id";
import { CreateStudentFormSchema } from "../../lib/students.schema";
import { CreateStudentForm } from "./create-student-form";
type CreateStudentFormModalProps = {
  hubId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateStudentFormModal = ({
  hubId,
  isOpen,
  onOpenChange,
}: CreateStudentFormModalProps) => {
  const { data: hub } = useHubById(hubId);

  if (!hub) {
    return null;
  }

  const form = useForm<z.infer<typeof CreateStudentFormSchema>>({
    resolver: zodResolver(CreateStudentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { mutateAsync: createStudentInHub, isPending } =
    useCreateStudentInHub();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        form.reset();
      }, 200);
    }
  };

  const onSubmit = async (data: z.infer<typeof CreateStudentFormSchema>) => {
    await createStudentInHub({ formData: data, hubId });
    handleOpenChange(false);
  };

  return (
    <Modal.Content size="md" isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header
        title="Create Student"
        description="Create and add a new student to your course."
      />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body className="pb-1 space-y-4">
          <CreateStudentForm form={form} autoFocus />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close size="small">Cancel</Modal.Close>
          <Button
            type="submit"
            shape="square"
            size="small"
            className="px-6"
            isPending={isPending}
          >
            {isPending && (
              <ProgressCircle
                isIndeterminate
                aria-label="Creating student..."
              />
            )}
            {isPending ? "Creating student..." : "Create Student"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
