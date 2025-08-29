import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";

import type { Student } from "@/db/schema";
import { StudentProfile } from "../../../shared/components/students/student-profile";
import { useDeleteStudent } from "../hooks/use-delete-student";

type DeleteStudentModalProps = {
  student?: Pick<Student, "id" | "name" | "email">;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteStudentModal = ({
  student,
  isOpen,
  onOpenChange,
}: DeleteStudentModalProps) => {
  const { mutateAsync: deleteStudentMutation, isPending: isDeletingStudent } =
    useDeleteStudent();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const isPending = isDeletingStudent;

  if (!student) return null;

  const deleteStudent = async () => {
    await deleteStudentMutation({ studentId: student.id });
    onOpenChange(false);
  };

  return (
    <Modal.Content
      role="alertdialog"
      size="md"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Modal.Header
        title="Delete Student"
        description="Are you sure you want to delete this student?"
      />

      <Modal.Body className="space-y-4">
        <StudentProfile
          name={student.name}
          email={student.email}
          image={null}
        />

        <Note intent="danger">
          <strong>Permanent Data Loss</strong>
          <p className="mt-1">
            The student will be permanently deleted and cannot be recovered
          </p>
        </Note>
      </Modal.Body>

      <Modal.Footer>
        <Modal.Close size="sm" isDisabled={isPending}>
          Cancel
        </Modal.Close>
        <Button
          type="button"
          size="sm"
          intent="danger"
          className="px-6"
          isPending={isPending}
          onPress={deleteStudent}
        >
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Removing student..." />
          )}
          {isPending ? "Deleting student..." : "Delete Student"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
