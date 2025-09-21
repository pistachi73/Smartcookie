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

      <Modal.Body className="px-6">
        <Note intent="danger">
          <strong>Permanent Data Loss</strong>
          <p className="mt-1">
            The following data will be permanently deleted and cannot be
            recovered:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
            <li>All attendance records for this student</li>
            <li>Course session links and associations</li>
          </ul>
        </Note>

        <div className="mt-4">
          <Note intent="info">
            <strong>Data Preservation</strong>
            <p className="mt-1">
              Survey responses will be archived and preserved for historical
              data analysis. These responses will no longer appear in this hub's
              feedback reports but will remain accessible in general feedback
              analytics.
            </p>
          </Note>
        </div>
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
