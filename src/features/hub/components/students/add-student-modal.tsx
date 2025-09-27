import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { Modal } from "@/ui/modal";
import { MultipleSelect } from "@/ui/multiple-select";
import { ProgressCircle } from "@/ui/progress-circle";

import { useAddStudentsToHub } from "../../hooks/students/use-add-studentd-to-hub";
import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { useStudentsByUserId } from "../../hooks/students/use-students-by-user-id";

type AddStudentModalProps = {
  hubId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddStudentFormSchema = z.object({
  studentIds: z.array(z.number()).min(1, "Please select at least one student"),
});

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
      studentIds: [],
    },
  });

  const { mutateAsync: addStudentsToHub, isPending: isAddingStudentToHub } =
    useAddStudentsToHub();

  const handleOpenChange = (open: boolean) => {
    243;
    onOpenChange(open);
    setTimeout(() => {
      form.reset();
    }, 200);
  };

  const onSubmit = async (data: z.infer<typeof AddStudentFormSchema>) => {
    await addStudentsToHub({
      studentIds: data.studentIds,
      hubId,
    });
    handleOpenChange(false);
  };

  const availableStudents = allUserStudents?.filter(
    (student) =>
      !hubStudents?.some((hubStudent) => hubStudent.id === student.id),
  );

  const selectedStudentIds = useWatch({
    control: form.control,
    name: "studentIds",
    defaultValue: [],
  });

  const isPending = isAddingStudentToHub;
  const hasAvailableStudents = (availableStudents?.length ?? 0) > 0;

  return (
    <Modal.Content size="lg" isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header
        title="Add Existing Students"
        description="Add existing students to your course."
      />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body className="pb-1 space-y-6 h-full max-h-[800px]">
          <Controller
            control={form.control}
            name="studentIds"
            render={({ field, fieldState }) => (
              <MultipleSelect
                label={
                  hasAvailableStudents ? "Select students" : "No students found"
                }
                items={availableStudents}
                selectedKeys={new Set(field.value || [])}
                onSelectionChange={(selection) => {
                  const selectedArray = Array.from(selection) as number[];
                  field.onChange(selectedArray);
                }}
                placeholder="Search for students"
                isDisabled={!hasAvailableStudents}
                className={{ popover: "min-w-auto w-[400px]" }}
                isInvalid={
                  fieldState.invalid ?? availableStudents?.length === 0
                }
                errorMessage={fieldState.error?.message}
                renderEmptyState={(inputValue) => (
                  <div className="flex-1 flex flex-col col-span-2 items-center p-4 gap-0.5">
                    <p className="text-sm font-medium">
                      {inputValue
                        ? "No students found"
                        : "No available students"}
                    </p>
                    <p className="text-xs text-muted-fg">
                      {inputValue
                        ? "You can search by name or email"
                        : "All students are already in this hub"}
                    </p>
                  </div>
                )}
              >
                {(item) => (
                  <MultipleSelect.Item
                    id={item.id}
                    textValue={item.name}
                    className="flex gap-3"
                  />
                )}
              </MultipleSelect>
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close size="sm">Cancel</Modal.Close>
          <Button
            type="submit"
            size="sm"
            className="px-6"
            isPending={isPending}
            isDisabled={availableStudents?.length === 0}
          >
            {isPending && (
              <ProgressCircle isIndeterminate aria-label="Adding students..." />
            )}
            {isPending
              ? "Adding students..."
              : selectedStudentIds?.length > 1
                ? `Add ${selectedStudentIds.length} Students`
                : "Add Student"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
