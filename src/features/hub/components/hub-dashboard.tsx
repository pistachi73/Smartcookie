"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddIcon,
  Folder01Icon,
  NoteAddIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";

import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { TABS } from "../lib/constants";
import { getHubByIdQueryOptions } from "../lib/hub-query-options";
import { CourseFeedback } from "./feedback";
import { HubDashboardLayout } from "./hub-dashboard-layout";
import { HubPanelHeader } from "./hub-panel-header";
import { SessionsList } from "./session/session-list";
import { Students } from "./students/students";

type Tab = (typeof TABS)[number]["id"];

export function HubDashboard({ hubId }: { hubId: number }) {
  const { data: hub } = useSuspenseQuery(getHubByIdQueryOptions(hubId));
  const [selectedTab, setSelectedTab] = useState<Tab>("sessions");

  if (!hub)
    return (
      <HubDashboardLayout hubName={"Hub not found"}>
        <div className="sm:p-6 p-4 pt-0!">
          <EmptyState
            title="Hub not found"
            description="The hub you are looking for does not exist."
            className="bg-white"
            icon={Folder01Icon}
          />
        </div>
      </HubDashboardLayout>
    );

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
              <SessionsList hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="students" className={"px-4 sm:px-6"}>
              <Students hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
              <CourseFeedback hubId={hubId} />
            </Tabs.Panel>
            <Tabs.Panel id="quick-notes" className={"px-4 sm:px-6 lg:hidden"}>
              <HubPanelHeader
                title="Quick Notes"
                actions={
                  <AddNoteCard
                    hubId={hubId}
                    className={"w-full sm:w-fit"}
                    size="sm"
                    intent="primary"
                  >
                    <HugeiconsIcon icon={NoteAddIcon} size={16} />
                    Add note
                  </AddNoteCard>
                }
              />
              <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
            </Tabs.Panel>
          </Tabs>
        </div>
        <Card className="w-full lg:w-[350px] hidden lg:flex">
          <Card.Header>
            <Card.Title>Quick Notes</Card.Title>
            <Card.Description>View the course notes</Card.Description>
            <Card.Action>
              <AddNoteCard hubId={hubId} intent="outline" size="sq-sm">
                <HugeiconsIcon icon={AddIcon} size={16} />
              </AddNoteCard>
            </Card.Action>
          </Card.Header>
          <Card.Content>
            <NoteCardList hubId={Number(hubId)} hubColor={hub.color} />
          </Card.Content>
        </Card>
      </div>
    </HubDashboardLayout>
  );
}
