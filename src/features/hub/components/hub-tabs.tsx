"use client";

import type { getHubById } from "@/data-access/hubs/queries";
import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import ViewportOnly from "@/shared/components/layout/viewport-context/viewport-only";
import { Heading } from "@/shared/components/ui/heading";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";
import {
  CalendarIcon as CalendarIconSolid,
  Comment01Icon as Comment01IconSolid,
  DashboardBrowsingIcon as DashboardBrowsingIconSolid,
  NoteIcon as NoteIconSolid,
  UserMultiple02Icon as UserMultiple02IconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  CalendarIcon,
  Comment01Icon,
  DashboardBrowsingIcon,
  NoteAddIcon,
  NoteIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { CourseFeedback } from "./feedback";
import { HubOverview } from "./hub-overview";
import { SessionsList } from "./session/session-list";
import { Students } from "./students/students";

const tabs: {
  id: string;
  label: string;
  icon: typeof UserMultiple02Icon;
  altIcon: typeof UserMultiple02IconSolid;
}[] = [
  {
    id: "overview",
    icon: DashboardBrowsingIcon,
    altIcon: DashboardBrowsingIconSolid,
    label: "Overview",
  },
  {
    id: "students",
    icon: UserMultiple02Icon,
    altIcon: UserMultiple02IconSolid,
    label: "Students",
  },
  {
    id: "sessions",
    icon: CalendarIcon,
    altIcon: CalendarIconSolid,
    label: "Sessions",
  },
  {
    id: "feedback",
    icon: Comment01Icon,
    altIcon: Comment01IconSolid,
    label: "Feedback",
  },
  {
    id: "quick-notes",
    icon: NoteIcon,
    altIcon: NoteIconSolid,
    label: "Quick Notes",
  },
];

const LoadingTabPanel = () => {
  return (
    <Tabs.Panel id="overview" className={"p-6 pt-0"}>
      <ProgressCircle isIndeterminate className="size-10" />
    </Tabs.Panel>
  );
};

export type HubTabs =
  | {
      isLoading: true;
      hub: undefined;
    }
  | {
      isLoading: false;
      hub: NonNullable<Awaited<ReturnType<typeof getHubById>>>;
    };

export const HubTabs = ({ isLoading, hub }: HubTabs) => {
  const { down } = useViewport();
  const isDownLg = down("lg");
  return (
    <Tabs
      aria-label="Hub Dashboard"
      defaultSelectedKey={"feedback"}
      className="flex-1 gap-4 sm:gap-6"
    >
      <Tabs.List className={"sticky top-0 px-6 pt-3 bg-overlay z-20"}>
        {tabs.map((tab) => {
          if (tab.id === "quick-notes" && !isDownLg) return null;
          return (
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
          );
        })}
      </Tabs.List>
      <Tabs.Panel id="overview" className={"p-6 pt-0"}>
        {isLoading ? <LoadingTabPanel /> : <HubOverview hubId={hub.id} />}
      </Tabs.Panel>
      <Tabs.Panel id="students" className={"px-2 sm:px-5 pt-0 py-2"}>
        {isLoading ? <LoadingTabPanel /> : <Students hubId={hub.id} />}
      </Tabs.Panel>
      <Tabs.Panel id="sessions" className={"px-2 sm:px-5 pt-0 py-2"}>
        {isLoading ? <LoadingTabPanel /> : <SessionsList hubId={hub.id} />}
      </Tabs.Panel>
      <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
        {isLoading ? <LoadingTabPanel /> : <CourseFeedback hubId={hub.id} />}
      </Tabs.Panel>
      {!isLoading && hub && (
        <ViewportOnly down="lg">
          <Tabs.Panel id="quick-notes" className={"p-4 py-2 "}>
            <div className="flex flex-row items-center justify-between mb-6">
              <Heading level={2}>Quick Notes</Heading>
              <AddNoteCard hubId={hub?.id} size="small" intent="primary">
                <HugeiconsIcon icon={NoteAddIcon} size={16} />
                Add note
              </AddNoteCard>
            </div>
            <NoteCardList hubId={Number(hub.id)} hubColor={hub.color} />
          </Tabs.Panel>
        </ViewportOnly>
      )}
    </Tabs>
  );
};
