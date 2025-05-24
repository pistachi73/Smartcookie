import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import {
  CommentAdd01Icon,
  DeleteIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useHubSurveys } from "../../hooks/feedback/use-hub-surveys";
import { CreateHubSurveyModal } from "./create-hub-survey-modal";

export const CourseFeedback = ({ hubId }: { hubId: number }) => {
  const { data } = useHubSurveys(hubId);
  const [isNewSurveyModalOpen, setIsNewSurveyModalOpen] = useState(false);
  const noSurveys = data?.length === 0;

  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between mb-8 flex-wrap gap-3 ">
          <Heading level={2}>Course Feedback</Heading>
          <Button
            shape="square"
            intent="primary"
            onPress={() => {
              setIsNewSurveyModalOpen(true);
            }}
          >
            <HugeiconsIcon
              icon={CommentAdd01Icon}
              altIcon={DeleteIcon}
              size={16}
              data-slot="icon"
            />
            Start new feedback survey
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {data?.length === 0 && (
            <div className="border bg-bg dark:bg-overlay-highlight rounded-lg border-dashed flex flex-col items-center justify-center w-full h-full p-6">
              <Heading level={3} className="mb-1">
                No feedback surveys created yet
              </Heading>
              <p className="text-muted-fg text-center max-w-xs">
                Create your first feedback survey to start tracking your
                tutoring activities.
              </p>
            </div>
          )}
        </div>
      </div>
      <CreateHubSurveyModal
        open={isNewSurveyModalOpen}
        onOpenChange={setIsNewSurveyModalOpen}
        hubId={hubId}
      />
    </>
  );
};
