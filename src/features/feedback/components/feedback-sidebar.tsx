"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatQuestionIcon as BubbleChatQuestionIconSolid,
  NewsIcon as NewsIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  BubbleChatQuestionIcon,
  NewsIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Tabs } from "@/shared/components/ui/tabs";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";

import { usePathname, useRouter } from "@/i18n/navigation";
import { QuestionsPanel } from "./questions/questions-panel";
import { SurveyTemplatesPanel } from "./survey-templates/survey-template-panel";

const tabs: {
  id: string;
  label: string;
  icon: typeof BubbleChatQuestionIcon;
  altIcon: typeof BubbleChatQuestionIcon;
}[] = [
  {
    id: "questions",
    icon: BubbleChatQuestionIcon,
    altIcon: BubbleChatQuestionIconSolid,
    label: "Questions",
  },
  {
    id: "surveys",
    icon: NewsIcon,
    altIcon: NewsIconSolid,
    label: "Templates",
  },
];

export const FeedbackSidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createHrefWithParams } = useNavigateWithParams();
  const tab =
    (searchParams.get("tab") as "questions" | "surveys") || "questions";

  // Guard against invalid tab values from URL
  const validTab = tab === "questions" || tab === "surveys" ? tab : "questions";

  // Redirect if tab is invalid
  useEffect(() => {
    if (validTab !== tab) {
      router.push(
        createHrefWithParams(pathname, { tab: validTab, page: null, q: null }),
      );
    }
  }, [validTab, tab, router, pathname, createHrefWithParams]);

  return (
    <div className="h-full border-r overflow-hidden">
      <Tabs
        className={"relative h-full overflow-hidden gap-0"}
        selectedKey={validTab}
        onSelectionChange={(key) => {
          router.push(
            createHrefWithParams(pathname, {
              tab: key as string,
              page: null,
              q: null,
            }),
          );
        }}
      >
        <Tabs.List className={"sticky top-0 px-4 h-12 pt-3"}>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} className="px-2">
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
        <Tabs.Panel id="questions" className={"overflow-hidden h-full"}>
          <QuestionsPanel />
        </Tabs.Panel>
        <Tabs.Panel id="surveys" className={"overflow-hidden h-full"}>
          <SurveyTemplatesPanel />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
