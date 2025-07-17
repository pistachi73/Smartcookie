"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { NoteAddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useMemo, useState } from "react";

import { Heading } from "@/shared/components/ui/heading";
import { Tabs } from "@/shared/components/ui/tabs";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import ViewportOnly from "@/shared/components/layout/viewport-context/viewport-only";
import { cn } from "@/shared/lib/classes";

import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { useHubById } from "../hooks/use-hub-by-id";
import { TABS } from "../lib/constants";
import { CourseFeedback } from "./feedback";
import { HubHeader } from "./hub-header";
import { HubOverview } from "./overview";
import { SessionsList } from "./session/session-list";
import { Students } from "./students/students";

type Tab = (typeof TABS)[number]["id"];

export function HubDashboard({ hubId }: { hubId: number }) {
  const { down } = useViewport();
  const { data: hub } = useHubById(hubId);
  const [selectedTab, setSelectedTab] = useState<Tab>("overview");

  const isDownLg = useMemo(() => down("lg"), [down]);

  if (!hub) return null;

  return (
    <div className="h-full overflow-auto flex flex-col">
      <HubHeader hubName={hub.name} />
      <div className="lg:flex-1 flex flex-col lg:flex-row bg-overlay">
        <Tabs
          aria-label="Hub Dashboard"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as Tab)}
          className="flex-1 gap-4 sm:gap-6"
        >
          <Tabs.List className={"sticky top-0 px-6 pt-3 bg-overlay z-20"}>
            {TABS.map((tab) => {
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
            <HubOverview hubId={hubId} setSelectedTab={setSelectedTab} />
          </Tabs.Panel>
          <Tabs.Panel id="students" className={"px-2 sm:px-5 pt-0 py-2"}>
            <Students hubId={hubId} />
          </Tabs.Panel>
          <Tabs.Panel id="sessions" className={"px-2 sm:px-5 pt-0 py-2"}>
            <SessionsList hubId={hubId} />
          </Tabs.Panel>
          <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
            <CourseFeedback hubId={hubId} />
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
                intent="plain"
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
