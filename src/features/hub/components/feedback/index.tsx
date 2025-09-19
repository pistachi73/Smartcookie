import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  CommentAdd01Icon,
  DeleteIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { PremiumLockedSection } from "@/shared/components/premium-locked-section";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

import { useHubById } from "../../hooks/use-hub-by-id";
import { getSurveysByHubIdQueryOptions } from "../../lib/hub-surveys-query-options";
import { HubPanelHeader } from "../hub-panel-header";
import { SurveysList } from "./surveys-list";

const LazyInitSurveyFromHubSheet = dynamic(
  () =>
    import("./init-survey-from-hub-sheet").then((mod) => ({
      default: mod.InitSurveyFromHubSheet,
    })),
  {
    ssr: false,
  },
);

export const CourseFeedback = ({ hubId }: { hubId: number }) => {
  const { data } = useQuery(getSurveysByHubIdQueryOptions(hubId));
  const { data: hub } = useHubById(hubId);

  const [isInitSurveySheetOpen, setIsInitSurveySheetOpen] = useState(false);
  const user = useCurrentUser();

  const header = (
    <HubPanelHeader
      title="Course Feedback"
      actions={
        <Button
          intent={!user?.hasActiveSubscription ? "secondary" : "primary"}
          className="w-full sm:w-fit"
          onPress={() => {
            setIsInitSurveySheetOpen(true);
          }}
          isDisabled={!user?.hasActiveSubscription}
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
  );

  return !user?.hasActiveSubscription ? (
    <div className="pb-20 w-full">
      {header}
      <div className="flex justify-center">
        <PremiumLockedSection
          className="w-full max-w-full"
          title="Feedback Surveys"
          description="Create your first feedback survey to start tracking your tutoring activities."
        />
      </div>
    </div>
  ) : (
    <>
      <div className="pb-20">
        {header}
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
          ) : (
            <SurveysList hubId={hubId} />
          )}
        </div>
      </div>
      <LazyInitSurveyFromHubSheet
        isOpen={isInitSurveySheetOpen}
        onOpenChange={setIsInitSurveySheetOpen}
        hubId={hubId}
        hubName={hub?.name ?? ""}
      />
    </>
  );
};
