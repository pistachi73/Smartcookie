import type { GetSurveysByHubIdQueryResponse } from "@/features/hub/lib/hub-surveys-query-options";
import {
  ResizablePanelContent,
  ResizablePanelRoot,
} from "@/shared/components/ui/resizable-panel";
import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";
import {
  BubbleChatQuestionIcon as BubbleChatQuestionIconSolid,
  User03Icon as User03IconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  BubbleChatQuestionIcon,
  User03Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { SurveyResponseByQuestion } from "./survey-response-by-question";
import { SurveyResponseByStudent } from "./survey-response-by-student";

const tabs: {
  id: string;
  label: string;
  icon: typeof BubbleChatQuestionIcon;
  altIcon: typeof BubbleChatQuestionIcon;
}[] = [
  {
    id: "by-question",
    icon: BubbleChatQuestionIcon,
    altIcon: BubbleChatQuestionIconSolid,
    label: "By Question",
  },
  {
    id: "by-student",
    icon: User03Icon,
    altIcon: User03IconSolid,
    label: "By Student",
  },
];

export const SurveyResponse = ({
  surveyId,
  surveyQuestions,
}: {
  surveyId: string;
  surveyQuestions: GetSurveysByHubIdQueryResponse[number]["surveyTemplate"]["questions"];
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("by-question");
  return (
    <Tabs
      aria-label="Hub Dashboard"
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as string)}
      className="flex-1 gap-4 sm:gap-6"
    >
      <Tabs.List className="px-4 pt-3 bg-overlay">
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.id} id={tab.id} className="px-2 ">
            {({ isSelected }) => {
              return (
                <p
                  className={cn(
                    "flex items-center gap-2",
                    isSelected && "text-primary",
                  )}
                >
                  <HugeiconsIcon
                    icon={tab.icon}
                    altIcon={tab.altIcon}
                    showAlt={isSelected}
                    strokeWidth={!isSelected ? 1.5 : undefined}
                    size={16}
                  />
                  {tab.label}
                </p>
              );
            }}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <ResizablePanelRoot value={selectedTab}>
        <ResizablePanelContent value="by-question">
          <Tabs.Panel id="by-question" className={"px-4 sm:px-6 pb-4 sm:pb-6"}>
            <SurveyResponseByQuestion
              surveyId={surveyId}
              surveyQuestions={surveyQuestions}
            />
          </Tabs.Panel>
        </ResizablePanelContent>
        <ResizablePanelContent value="by-student">
          <Tabs.Panel id="by-student" className={"px-4 sm:px-6 pb-4 sm:pb-6"}>
            <SurveyResponseByStudent
              surveyId={surveyId}
              surveyQuestions={surveyQuestions}
            />
          </Tabs.Panel>
        </ResizablePanelContent>
      </ResizablePanelRoot>
    </Tabs>
  );
};
