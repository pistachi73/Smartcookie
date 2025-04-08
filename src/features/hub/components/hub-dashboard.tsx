"use client";

import { AddNoteCard } from "@/features/notes/components/add-note-card";
import { NoteCardList } from "@/features/notes/components/note-card-list";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import ViewportOnly from "@/shared/components/layout/viewport-context/viewport-only";
import { Heading } from "@/shared/components/ui/heading";
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
  ArrowLeft02Icon,
  CalendarIcon,
  Comment01Icon,
  DashboardBrowsingIcon,
  NoteAddIcon,
  NoteIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo } from "react";
import { useHubById } from "../hooks/use-hub-by-id";
import { SessionsList } from "./session/session-list";

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

export function HubDashboard({ hubId }: { hubId: number }) {
  const { down } = useViewport();
  const { data: hub } = useHubById(hubId);

  if (!hub) return null;

  const isDownLg = useMemo(() => down("lg"), [down]);

  return (
    <div className="h-full overflow-auto flex flex-col lg:*:text-red-100">
      <div className="shrink-0 overflow-auto p-6 border-b space-y-4 bg-bg">
        <Link
          href="/portal/hubs"
          className="flex items-center gap-2 text-sm text-muted-fg"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          Back to courses
        </Link>
        <Heading level={1} className="font-bold">
          {hub.name}
        </Heading>
      </div>
      <div className="lg:flex-1 flex flex-col lg:flex-row bg-overlay">
        <Tabs
          aria-label="Hub Dashboard"
          defaultSelectedKey={"sessions"}
          className="flex-1"
        >
          <Tabs.List className={"sticky top-0 px-4 pt-3 bg-overlay z-20"}>
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
          <Tabs.Panel id="students" className={"p-4 pt-0"}>
            students
          </Tabs.Panel>
          <Tabs.Panel id="sessions" className={"px-2 sm:px-5 pt-0"}>
            <SessionsList hubId={hubId} />
          </Tabs.Panel>
          <Tabs.Panel id="feedback" className={"p-4 pt-0"}>
            Discover curated meal plans to simplify your weekly cooking.
          </Tabs.Panel>
          <ViewportOnly down="lg">
            <Tabs.Panel id="quick-notes" className={"p-4 py-2 "}>
              <div className="flex flex-row items-center justify-between mb-6">
                <Heading level={2}>Quick Notes</Heading>
                <AddNoteCard hubId={hubId} size="small" intent="primary">
                  <HugeiconsIcon icon={NoteAddIcon} size={16} />
                  Add note
                </AddNoteCard>
              </div>
              <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
            </Tabs.Panel>
          </ViewportOnly>
        </Tabs>
        {!isDownLg && (
          <div className="w-full lg:w-[350px]">
            {/* Quick Notes Section */}
            <div className="border-t lg:border-t-0 lg:border-l sticky top-0 z-20 bg-overlay h-12 px-4 border-b flex flex-row items-center justify-between gap-2">
              <Heading level={2} className="text-base! font-medium!">
                Quick Notes
              </Heading>
              <AddNoteCard
                hubId={hubId}
                appearance="plain"
                size="square-petite"
                className="size-9"
              />
            </div>
            <div className="lg:border-l h-full p-3">
              <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
