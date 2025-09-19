import { HugeiconsIcon } from "@hugeicons/react";
import {
  CommentAdd01Icon,
  DeleteIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

import { HubPanelHeader } from "../hub-panel-header";
import { SkeletonSurveyListItem } from "./skeleton-survey-list-item";

export const HubFeedbackLoading = () => {
  return (
    <div className="pb-20">
      <HubPanelHeader
        title="Course Feedback"
        actions={
          <Button intent="primary" className="w-full sm:w-fit">
            <HugeiconsIcon
              icon={CommentAdd01Icon}
              altIcon={DeleteIcon}
              size={16}
              data-slot="icon"
            />
            Start new feedback survey
          </Button>
        }
      />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonSurveyListItem key={`skeleton-survey-list-item-${index}`} />
        ))}
      </div>
    </div>
  );
};
