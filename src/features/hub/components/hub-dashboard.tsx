"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  FolderLibraryIcon,
  NoteAddIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { Tabs } from "@/shared/components/ui/tabs";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import ViewportOnly from "@/shared/components/layout/viewport-context/viewport-only";
import { cn } from "@/shared/lib/classes";

import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { TABS } from "../lib/constants";
import { getHubByIdQueryOptions } from "../lib/hub-query-options";
import { CourseFeedback } from "./feedback";
import { HubHeader } from "./hub-header";
import { HubPanelHeader } from "./hub-panel-header";
import { HubOverview } from "./overview";
import { SessionsList } from "./session/session-list";
import { Students } from "./students/students";

type Tab = (typeof TABS)[number]["id"];

export function HubDashboard({ hubId }: { hubId: number }) {
  const { down } = useViewport();
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  const [selectedTab, setSelectedTab] = useState<Tab>("overview");

  const isDownLg = useMemo(() => down("lg"), [down]);

  if (!hub) return null;

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
          {
            label: hub.name,
            href: `/portal/hubs/${hubId}`,
            icon: Folder02Icon,
          },
        ]}
      />
      <div className="h-full overflow-auto flex flex-col bg-bg">
        <HubHeader hubName={hub.name} />
        <div className="lg:flex-1 flex flex-col lg:flex-row p-6 pt-0 gap-6">
          <div className="bg-white rounded-lg border flex-1">
            <Tabs
              aria-label="Hub Dashboard"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as Tab)}
              className="flex-1 gap-4 sm:gap-6"
            >
              <Tabs.List className={"sticky top-0 px-6 pt-3 z-20"}>
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
              <Tabs.Panel id="students" className={"px-4 sm:px-6"}>
                <Students hubId={hubId} />
              </Tabs.Panel>
              <Tabs.Panel id="sessions" className={"px-4 sm:px-6"}>
                <SessionsList hubId={hubId} />
              </Tabs.Panel>
              <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
                <CourseFeedback hubId={hubId} />
              </Tabs.Panel>
              <ViewportOnly down="lg">
                <Tabs.Panel id="quick-notes" className={"px-4 sm:px-6"}>
                  <HubPanelHeader
                    title="Quick Notes"
                    actions={
                      <AddNoteCard
                        hubId={hubId}
                        className={"w-full sm:w-fit"}
                        size="small"
                        intent="primary"
                      >
                        <HugeiconsIcon icon={NoteAddIcon} size={16} />
                        Add note
                      </AddNoteCard>
                    }
                  />
                  {/* <div className="flex flex-row items-center justify-between mb-6">
                  <Heading level={2}>Quick Notes</Heading>
                  <AddNoteCard hubId={hubId} size="small" intent="primary">
                    <HugeiconsIcon icon={NoteAddIcon} size={16} />
                    Add note
                  </AddNoteCard>
                </div> */}
                  <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
                </Tabs.Panel>
              </ViewportOnly>
            </Tabs>
          </div>
          {!isDownLg && (
            <Card className="w-full lg:w-[350px]">
              <Card.Header>
                <Card.Title>Quick Notes</Card.Title>
                <Card.Description>View the course notes</Card.Description>
                <Card.Action>
                  <AddNoteCard
                    hubId={hubId}
                    intent="plain"
                    size="square-petite"
                    className="size-9"
                  >
                    <HugeiconsIcon icon={NoteAddIcon} size={16} />
                  </AddNoteCard>
                </Card.Action>
              </Card.Header>
              <Card.Content>
                <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
