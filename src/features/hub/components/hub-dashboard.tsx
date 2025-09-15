"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";

import { TABS } from "../lib/constants";
import { getHubByIdQueryOptions } from "../lib/hub-query-options";
import { HubFeedbackLoading } from "./feedback/hub-feedback-loading";
import { HubDashboardLayout } from "./hub-dashboard-layout";
import { HubNotFound } from "./hub-not-found";
import { HubNotesPanelLoading } from "./notes/hub-notes-panel-loading";
import { HubNotesCardLoading } from "./notes/hub-notest-card-loading";
import { HubSessionsLoading } from "./session/hub-sessions-loading";
import { HubStudentsLoading } from "./students/hub-students-loading";

const LazySessionsList = dynamic(
  () =>
    import("./session/session-list").then((mod) => ({
      default: mod.SessionsList,
    })),
  {
    ssr: false,
    loading: HubSessionsLoading,
  },
);

const LazyStudents = dynamic(
  () =>
    import("./students/students").then((mod) => ({ default: mod.Students })),
  {
    ssr: false,
    loading: HubStudentsLoading,
  },
);

const LazyCourseFeedback = dynamic(
  () => import("./feedback").then((mod) => ({ default: mod.CourseFeedback })),
  {
    ssr: false,
    loading: HubFeedbackLoading,
  },
);

const LazyHubNotesCard = dynamic(
  () =>
    import("./notes/hub-notes-card").then((mod) => ({
      default: mod.HubNotesCard,
    })),
  {
    ssr: false,
    loading: HubNotesCardLoading,
  },
);

const LazyHubNotesPanel = dynamic(
  () =>
    import("./notes/hub-notes-panel").then((mod) => ({
      default: mod.HubNotesPanel,
    })),
  {
    ssr: false,
    loading: HubNotesPanelLoading,
  },
);

type Tab = (typeof TABS)[number]["id"];

export function HubDashboard({ hubId }: { hubId: number }) {
  const { data: hub } = useSuspenseQuery(getHubByIdQueryOptions(hubId));
  const [selectedTab, setSelectedTab] = useState<Tab>("sessions");

  if (!hub) return <HubNotFound />;

  return (
    <HubDashboardLayout hubName={hub.name}>
      <div className="flex-1 flex flex-col lg:flex-row p-0 sm:p-6 sm:pt-0 gap-6">
        <div className="bg-white sm:rounded-lg border flex-1">
          <Tabs
            aria-label="Hub Dashboard"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as Tab)}
            className="flex-1 gap-4 sm:gap-6 h-full"
          >
            <Tabs.List className={"px-4 sm:px-6 h-10 "}>
              {TABS.map((tab) => {
                return (
                  <Tabs.Tab
                    key={tab.id}
                    id={tab.id}
                    className={cn(
                      "px-2 pb-0!",
                      tab.id === "quick-notes" && "lg:hidden",
                    )}
                  >
                    {({ isSelected }) => {
                      return (
                        <p
                          className={cn(
                            "flex items-center gap-2",
                            isSelected && "text-primary",
                          )}
                        >
                          {tab.label}
                        </p>
                      );
                    }}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>

            <Tabs.Panel id="sessions" className={"px-4 sm:px-6"}>
              <LazySessionsList hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="students" className={"px-4 sm:px-6"}>
              <LazyStudents hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
              <LazyCourseFeedback hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="quick-notes" className={"px-4 sm:px-6 lg:hidden"}>
              <LazyHubNotesPanel hubId={hubId} hubColor={hub.color} />
            </Tabs.Panel>
          </Tabs>
        </div>
        <div className="w-full lg:w-[350px] hidden lg:flex">
          <LazyHubNotesCard hubId={hubId} hubColor={hub.color} />
        </div>
      </div>
    </HubDashboardLayout>
  );
}
