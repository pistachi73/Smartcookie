"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDownDoubleIcon,
  ArrowLeft02Icon,
  ArrowUpDoubleIcon,
  Calendar02Icon,
  CalendarAdd02Icon,
  DeleteIcon,
  Pen01Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { regularSpring } from "@/shared/lib/animation";

import { getHubByIdQueryOptions } from "../../lib/hub-query-options";
import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";
import { useSessionStore } from "../../store/session-store";
import { HubPanelHeader } from "../hub-panel-header";
import { AddSessionsButton } from "./add-sessions-button";
import { DesktopSessionBubble, Session } from "./session";
import { SessionNavigationBar } from "./session-navigation-bar";
import { SessionSkeleton } from "./session-skeleton";

const DynamicAddSessionsFormModal = dynamic(
  () =>
    import("./add-sessions-form-modal").then((mod) => mod.AddSessionsFormModal),
  {
    ssr: false,
  },
);
const DynamicDeleteSessionsModal = dynamic(
  () =>
    import("./delete-sessions-modal-content").then(
      (mod) => mod.DeleteSessionsModalContent,
    ),
  {
    ssr: false,
  },
);

export function SessionsList({ hubId }: { hubId: number }) {
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  const [allSessionsExpanded, setAllSessionsExpanded] = useState(false);
  const { down } = useViewport();

  const {
    isEditingMode,
    selectedSessions,
    setIsEditingMode,
    setIsAddModalOpen,
    setIsDeleteModalOpen,
    isAddModalOpen,
  } = useSessionStore(
    useShallow((store) => ({
      isEditingMode: store.isEditingMode,
      selectedSessions: store.selectedSessions,
      setIsEditingMode: store.setIsEditingMode,
      setIsAddModalOpen: store.setIsAddModalOpen,
      setIsDeleteModalOpen: store.setIsDeleteModalOpen,
      isAddModalOpen: store.isAddModalOpen,
    })),
  );

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isPending: isLoadingSessions,
    refetch,
  } = useInfiniteQuery(getPaginatedSessionsByHubIdQueryOptions(hubId));

  // Flatten all sessions from all pages - backend handles correct ordering
  const sessions = (data as any)?.pages
    ? (data as any).pages.flatMap((page: any) => page.sessions)
    : [];

  const isMobile = down("sm");

  const handleEditModeToggle = () => {
    setIsEditingMode(!isEditingMode);
  };

  const hasSessions = sessions?.length > 0 && !isLoadingSessions;

  const viewOnlyMode = hub?.status === "inactive";

  const actions = (
    <div className="flex gap-2 sm:flex-row justify-between sm:justify-end flex-1">
      {hasSessions && (
        <>
          <Button
            size="sq-sm"
            intent="outline"
            onPress={() => {
              setAllSessionsExpanded(!allSessionsExpanded);
            }}
            className="shrink-0 sm:hidden"
          >
            <HugeiconsIcon
              icon={ArrowDownDoubleIcon}
              altIcon={ArrowUpDoubleIcon}
              showAlt={allSessionsExpanded}
              data-slot="icon"
            />
          </Button>
          <Button
            size={isMobile ? "sq-sm" : "sm"}
            intent={isEditingMode ? "secondary" : "outline"}
            onPress={handleEditModeToggle}
            isDisabled={isLoadingSessions || viewOnlyMode}
            className="shrink-0"
          >
            {isEditingMode ? (
              <>
                <HugeiconsIcon icon={Tick01Icon} data-slot="icon" />
                {!isMobile && <span>Done</span>}
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Pen01Icon} data-slot="icon" />
                {!isMobile && <span>Edit</span>}
              </>
            )}
          </Button>
        </>
      )}
      {isEditingMode ? (
        <Button
          intent="danger"
          size="sm"
          onPress={() => setIsDeleteModalOpen(true)}
          className={"w-full sm:w-fit"}
          isDisabled={
            isLoadingSessions || selectedSessions.length === 0 || viewOnlyMode
          }
        >
          <HugeiconsIcon icon={DeleteIcon} data-slot="icon" />
          <p>Delete sessions</p>
        </Button>
      ) : (
        <AddSessionsButton
          size={"sm"}
          intent="primary"
          onPress={() => setIsAddModalOpen(true)}
          hubId={hubId}
          className={"w-full sm:w-fit"}
          isDisabled={viewOnlyMode}
        >
          <HugeiconsIcon icon={CalendarAdd02Icon} data-slot="icon" />
          <p>Add session</p>
        </AddSessionsButton>
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-0 pb-20 sm:pb-0">
        <HubPanelHeader title="Sessions timeline" actions={actions} />
        {sessions?.length !== 0 && !isLoadingSessions && (
          <div className="w-full flex justify-center">
            <SessionNavigationBar
              onFetchPrevious={() => fetchPreviousPage()}
              onFetchNext={() => fetchNextPage()}
              hasPrevious={hasPreviousPage}
              hasNext={hasNextPage}
              isLoadingPrevious={isFetchingPreviousPage}
              isLoadingNext={isFetchingNextPage}
              totalSessions={sessions?.length || 0}
              onToggleAllSessionsExpanded={() =>
                setAllSessionsExpanded(!allSessionsExpanded)
              }
              allSessionsExpanded={allSessionsExpanded}
              className="mb-4"
            />
          </div>
        )}

        {sessions?.length === 0 && !hasPreviousPage && (
          <EmptyState
            title="No upcoming sessions"
            description="Create your next session to see it here. Past sessions can be
            viewed using the 'Show past sessions' button above."
            icon={Calendar02Icon}
            action={
              <Button
                intent="primary"
                onPress={() => setIsAddModalOpen(true)}
                isDisabled={viewOnlyMode}
              >
                Create session
              </Button>
            }
          />
        )}
        {sessions?.length === 0 && hasPreviousPage && (
          <EmptyState
            title="No upcoming sessions"
            description="Create your next session to see it here or view your past sessions."
            icon={Calendar02Icon}
            action={
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full justify-center">
                {!viewOnlyMode && (
                  <AddSessionsButton
                    hubId={hubId}
                    onPress={() => setIsAddModalOpen(true)}
                    isDisabled={viewOnlyMode}
                  >
                    <HugeiconsIcon icon={CalendarAdd02Icon} data-slot="icon" />
                    Create session
                  </AddSessionsButton>
                )}
                <Button
                  intent="outline"
                  onPress={() => fetchPreviousPage()}
                  isDisabled={!hasPreviousPage || isFetchingPreviousPage}
                >
                  {isFetchingPreviousPage ? (
                    <ProgressCircle
                      className="size-4"
                      isIndeterminate
                      aria-label="Loading past sessions"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      data-slot="icon"
                      className="size-4"
                    />
                  )}
                  Show past sessions
                </Button>
              </div>
            }
          />
        )}

        {isLoadingSessions ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SessionSkeleton key={`session-skeleton-${index}`} />
          ))
        ) : (
          <LayoutGroup>
            {sessions?.map((session: any, index: number) => {
              return (
                <m.div
                  layout
                  transition={{
                    layout: regularSpring,
                  }}
                  key={`session-${session.id}`}
                  className="sm:flex gap-4"
                >
                  {!isMobile && (
                    <DesktopSessionBubble
                      session={session}
                      index={index}
                      totalSessions={sessions.length}
                    />
                  )}
                  <Session
                    key={session.id}
                    session={session}
                    hubId={hubId}
                    isExpanded={allSessionsExpanded}
                  />
                </m.div>
              );
            })}
          </LayoutGroup>
        )}
      </div>
      <DynamicAddSessionsFormModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        hubId={hubId}
        disableHubSelection={true}
        onSuccessfullyAddedSessions={() => {
          refetch();
        }}
      />
      <DynamicDeleteSessionsModal hubId={hubId} />
    </>
  );
}
