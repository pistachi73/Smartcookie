"use client";

import type { SurveyTemplate } from "@/db/schema";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { useRouter } from "next/navigation";
import { useDeleteSurveyTemplate } from "../../hooks/survey-templates/use-delete-survey-template";

interface DeleteSurveyTemplateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  surveyTemplate: Pick<SurveyTemplate, "id" | "title" | "description">;
}

export const DeleteSurveyTemplateModal = ({
  isOpen,
  onOpenChange,
  surveyTemplate,
}: DeleteSurveyTemplateModalProps) => {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const { mutate: deleteSurveyTemplate, isPending: isDeleting } =
    useDeleteSurveyTemplate({
      onSuccess: () => {
        onOpenChange(false);
        router.push(createHrefWithParams("/portal/feedback/"));
      },
    });

  const handleDelete = () => {
    deleteSurveyTemplate({ id: surveyTemplate.id });
  };

  return (
    <Modal.Content
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isDeleting}
      size="md"
    >
      <Modal.Header>
        <Modal.Title>Delete Survey</Modal.Title>
        <Modal.Description>
          Are you sure you want to delete this survey? This action cannot be
          undone.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3 bg-muted rounded-md border mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-balance">
                {surveyTemplate.title}
              </p>
              {surveyTemplate.description && (
                <p className="text-xs text-muted-fg line-clamp-2 mt-1">
                  {surveyTemplate.description}
                </p>
              )}
            </div>
          </div>
        </div>
        <Note intent="warning">
          <strong>Important:</strong> This survey template will be permanently
          deleted along with all associated surveys and responses. This action
          cannot be undone.
        </Note>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close isDisabled={isDeleting}>Cancel</Modal.Close>
        <Button intent="danger" onPress={handleDelete} isPending={isDeleting}>
          {isDeleting && (
            <ProgressCircle isIndeterminate aria-label="Deleting survey..." />
          )}
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
