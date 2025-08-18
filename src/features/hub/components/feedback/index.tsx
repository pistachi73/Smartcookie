import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  CommentAdd01Icon,
  DeleteIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { useHubById } from "../../hooks/use-hub-by-id";
import { getSurveysByHubIdQueryOptions } from "../../lib/hub-surveys-query-options";
import { HubPanelHeader } from "../hub-panel-header";
import { InitSurveyFromHubSheet } from "./init-survey-from-hub-sheet";
import { SurveysList } from "./surveys-list";

export const CourseFeedback = ({ hubId }: { hubId: number }) => {
  const { data } = useQuery(getSurveysByHubIdQueryOptions(hubId));
  const { data: hub } = useHubById(hubId);

  const [isInitSurveySheetOpen, setIsInitSurveySheetOpen] = useState(false);

  return (
    <>
      <div className="pb-20">
        <HubPanelHeader
          title="Course Feedback"
          actions={
            <Button
              shape="square"
              size="small"
              intent="primary"
              className="w-full sm:w-fit"
              onPress={() => {
                setIsInitSurveySheetOpen(true);
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
          }
        />

        <div className="flex flex-col gap-4">
          {data?.length === 0 ? (
            <EmptyState
              title="No feedback surveys created yet"
              description="Create your first feedback survey to start tracking your tutoring activities."
              icon={Comment01Icon}
              action={
                <Button
                  intent="primary"
                  onPress={() => {
                    setIsInitSurveySheetOpen(true);
                  }}
                >
                  <HugeiconsIcon
                    icon={Rocket01Icon}
                    size={16}
                    data-slot="icon"
                  />
                  New survey
                </Button>
              }
            />

            // <div className="border bg-bg dark:bg-overlay-highlight rounded-lg border-dashed flex flex-col items-center justify-center w-full h-full p-6">
            //   <Heading level={3} className="mb-1">
            //     No feedback surveys created yet
            //   </Heading>
            //   <p className="text-muted-fg text-center max-w-xs">
            //     Create your first feedback survey to start tracking your
            //     tutoring activities.
            //   </p>
            // </div>
          ) : (
            <SurveysList hubId={hubId} />
          )}
        </div>
      </div>
      <InitSurveyFromHubSheet
        isOpen={isInitSurveySheetOpen}
        onOpenChange={setIsInitSurveySheetOpen}
        hubId={hubId}
        hubName={hub?.name ?? ""}
      />
    </>
  );
};
