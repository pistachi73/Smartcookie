"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs } from "@/shared/components/ui/tabs";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import ViewportOnly from "@/shared/components/layout/viewport-context/viewport-only";
import { cn } from "@/shared/lib/classes";

import { HubHeader } from "@/features/hub/components/hub-header";
import { SkeletonNoteCardList } from "@/features/quick-notes/components/skeleton-note-card-list";
import { TABS } from "../lib/constants";
import { SessionSkeleton } from "./session/session-skeleton";
import { SkeletonStudentListView } from "./students/skeleton-student-list-view";

// Overview skeleton component
const OverviewSkeleton = () => (
  <div className="space-y-6">
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-overlay space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* Chart area */}
    <div className="border rounded-lg bg-overlay p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>

    {/* Quick stats */}
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg bg-overlay p-4 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="border rounded-lg bg-overlay p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  </div>
);

// Sessions skeleton component
const SessionsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <SessionSkeleton key={i} position={i + 1} />
      ))}
    </div>
  </div>
);

// Feedback skeleton component
const FeedbackSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-9 w-48" />
    </div>

    {/* Survey cards */}
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="border rounded-lg bg-overlay p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HubLoading = () => {
  const { down } = useViewport();
  const isDownLg = down("lg");

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
          "skeleton",
        ]}
      />
      <HubHeader />

      <div className="h-full overflow-auto flex flex-col">
        <div className="lg:flex-1 flex flex-col lg:flex-row bg-overlay">
          <Tabs
            aria-label="Hub Dashboard Loading"
            className="flex-1 gap-4 sm:gap-6"
            selectedKey="overview"
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
              <OverviewSkeleton />
            </Tabs.Panel>

            <Tabs.Panel id="students" className={"px-2 sm:px-5 pt-0 py-2"}>
              <SkeletonStudentListView />
            </Tabs.Panel>

            <Tabs.Panel id="sessions" className={"px-2 sm:px-5 pt-0 py-2"}>
              <SessionsSkeleton />
            </Tabs.Panel>

            <Tabs.Panel id="feedback" className={"px-4 sm:px-6"}>
              <FeedbackSkeleton />
            </Tabs.Panel>

            <ViewportOnly down="lg">
              <Tabs.Panel id="quick-notes" className={"p-4 py-2 "}>
                <div className="flex flex-row items-center justify-between mb-6">
                  <Heading level={2}>Quick Notes</Heading>
                  <Skeleton className="h-9 w-24" />
                </div>
                <SkeletonNoteCardList />
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
                <Skeleton className="h-9 w-9 rounded" />
              </div>
              <div className="lg:border-l h-full p-3">
                <SkeletonNoteCardList />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
