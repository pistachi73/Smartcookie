import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { useRemoveStudentFromHub } from "../../hooks/students/use-remove-student-from-hub";

type RemoveStudentModalProps = {
  studentId?: number;
  hubId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RemoveStudentModal = ({
  studentId,
  hubId,
  isOpen,
  onOpenChange,
}: RemoveStudentModalProps) => {
  const {
    mutateAsync: removeStudentFromHub,
    isPending: isRemovingStudentFromHub,
  } = useRemoveStudentFromHub();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const isPending = isRemovingStudentFromHub;

  if (!studentId) return null;

  const removeStudent = async () => {
    await removeStudentFromHub({ studentId, hubId });
    onOpenChange(false);
  };

  return (
    <Modal.Content
      role="alertdialog"
      size="md"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Modal.Header title="Remove Student" />

      <div className="px-6">
        <Note intent="danger">
          <strong>Warning: Permanent Data Loss</strong>
          <p className="mt-1">
            Removing this student will permanently delete all attendance records
            and course session links associated with them.
          </p>
        </Note>
      </div>

      <Modal.Footer>
        <Modal.Close size="small">Cancel</Modal.Close>
        <Button
          type="button"
          shape="square"
          size="small"
          intent="danger"
          className="px-6"
          isPending={isPending}
          onPress={removeStudent}
        >
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Removing student..." />
          )}
          {isPending ? "Removing student..." : "Remove Student"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
