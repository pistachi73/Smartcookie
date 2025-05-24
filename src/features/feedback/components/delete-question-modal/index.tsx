"use client";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import type { FeedbackQuestion } from "../../components/question-list-item";
import { useDeleteQuestion } from "../../hooks/use-delete-question";
import { QuestionTypeBadge } from "../question-type-badge";

interface DeleteQuestionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: FeedbackQuestion;
}

export const DeleteQuestionModal = ({
  isOpen,
  onOpenChange,
  question,
}: DeleteQuestionModalProps) => {
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    deleteQuestion({ id: question.id });
  };

  return (
    <Modal.Content
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isDeleting}
      size="md"
    >
      <Modal.Header>
        <Modal.Title>Delete Question</Modal.Title>
        <Modal.Description>
          Are you sure you want to delete this question? This action cannot be
          undone.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3 bg-muted rounded-md border mb-3">
          <div className="flex items-center gap-3">
            <QuestionTypeBadge type={question.type} />
            <p className="font-medium text-sm text-balance">{question.title}</p>
          </div>
        </div>
        <Note intent="warning">
          <strong>Important:</strong> This question will also be deleted from
          any pending or finished surveys that use it. Survey responses to this
          question will be permanently lost.
        </Note>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close isDisabled={isDeleting}>Cancel</Modal.Close>
        <Button intent="danger" onPress={handleDelete} isPending={isDeleting}>
          {isDeleting && (
            <ProgressCircle isIndeterminate aria-label="Deleting question..." />
          )}
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
