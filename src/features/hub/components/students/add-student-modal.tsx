import { Button } from "@/shared/components/ui/button";
import { ComboBox } from "@/shared/components/ui/combo-box";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useAddStudentToHub } from "../../hooks/students/use-add-student-to-hub";
import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { useStudentsByUserId } from "../../hooks/students/use-students-by-user-id";
import { AddStudentFormSchema } from "../../lib/students.schema";
import { StudentProfile } from "../create-hub-multistep-form/step-students/student-profile";

type AddStudentModalProps = {
  hubId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddStudentModal = ({
  hubId,
  isOpen,
  onOpenChange,
}: AddStudentModalProps) => {
  const { data: allUserStudents } = useStudentsByUserId();
  const { data: hubStudents } = useStudentsByHubId(hubId);

  const form = useForm<z.infer<typeof AddStudentFormSchema>>({
    resolver: zodResolver(AddStudentFormSchema),
    defaultValues: {
      studentId: undefined,
    },
  });

  const { mutateAsync: addStudentToHub, isPending: isAddingStudentToHub } =
    useAddStudentToHub();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    setTimeout(() => {
      form.reset();
    }, 200);
  };

  const onSubmit = async (data: z.infer<typeof AddStudentFormSchema>) => {
    await addStudentToHub({ ...data, hubId });
    handleOpenChange(false);
  };

  const comboboxItems = allUserStudents?.filter(
    (student) =>
      !hubStudents?.some((hubStudent) => hubStudent.id === student.id),
  );

  const isPending = isAddingStudentToHub;

  return (
    <Modal.Content size="md" isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header
        title="Add Existing Student"
        description="Add an existing student to your course."
      />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body className="pb-1 space-y-6">
          <Controller
            control={form.control}
            name="studentId"
            render={({ field, fieldState }) => (
              <ComboBox
                placeholder="Search existing student..."
                menuTrigger="focus"
                onSelectionChange={(value) => field.onChange(value)}
                selectedKey={field.value}
                errorMessage={fieldState.error?.message}
                isInvalid={fieldState.invalid}
                label="Select student"
                allowsEmptyCollection={true}
              >
                <ComboBox.Input
                  showArrow
                  className={{
                    input: "text-sm",
                  }}
                />

                <ComboBox.List
                  renderEmptyState={() => (
                    <div className="flex-1 flex flex-col col-span-2 items-center p-4 gap-0.5">
                      <p className="text-sm font-medium">No students found</p>
                      <p className="text-xs text-muted-fg">
                        You can search by name or email
                      </p>
                    </div>
                  )}
                  items={comboboxItems}
                  className={{
                    popoverContent: "w-[calc(var(--trigger-width))]",
                  }}
                  showArrow={false}
                >
                  {(item) => {
                    return (
                      <ComboBox.Option
                        id={item.id}
                        textValue={item.name}
                        className={"flex gap-3"}
                        showTick={false}
                      >
                        <StudentProfile
                          name={item.name}
                          email={item.email}
                          image={item.image}
                        />
                      </ComboBox.Option>
                    );
                  }}
                </ComboBox.List>
              </ComboBox>
            )}
          />
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
              <ProgressCircle isIndeterminate aria-label="Adding student..." />
            )}
            {isPending ? "Adding student..." : "Add Student"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
