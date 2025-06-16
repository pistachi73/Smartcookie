"use client";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { format } from "date-fns";
import { useDeleteSurvey } from "../../hooks/feedback/use-delete-survey";
import type { GetSurveysByHubIdQueryResponse } from "../../lib/hub-surveys-query-options";

interface DeleteSurveyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  survey: GetSurveysByHubIdQueryResponse[number];
  hubId: number;
}

export const DeleteSurveyModal = ({
  isOpen,
  onOpenChange,
  survey,
  hubId,
}: DeleteSurveyModalProps) => {
  const { mutate: deleteSurvey, isPending: isDeleting } = useDeleteSurvey({
    hubId,
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    deleteSurvey({ surveyId: survey.id });
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
                {survey.surveyTemplate.title}
              </p>
              <p className="text-xs text-muted-fg mt-1">
                Created on {format(survey.createdAt, "PPP")}
              </p>
              {survey.surveyTemplate.description && (
                <p className="text-xs text-muted-fg line-clamp-2 mt-1">
                  {survey.surveyTemplate.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <Note intent="warning">
          <strong>Survey Deletion</strong>
          <p className="mt-1">
            This survey will be permanently deleted. However, all survey
            responses will be preserved and remain available for survey template
            analytics and historical data analysis.
          </p>
        </Note>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close isDisabled={isDeleting}>Cancel</Modal.Close>
        <Button intent="danger" onPress={handleDelete} isPending={isDeleting}>
          {isDeleting && (
            <ProgressCircle isIndeterminate aria-label="Deleting survey..." />
          )}
          {isDeleting ? "Deleting..." : "Delete Survey"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
