"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  CalendarAdd02Icon,
  DeleteIcon,
  Pen01Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Loader } from "@/shared/components/ui/loader";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { regularSpring } from "@/shared/lib/animation";

import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";
import { useSessionStore } from "../../store/session-store";
import { HubPanelHeader } from "../hub-panel-header";
import { DesktopSessionBubble, Session } from "./session";
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
  } = useSuspenseInfiniteQuery(getPaginatedSessionsByHubIdQueryOptions(hubId));

  // Flatten all sessions from all pages - backend handles correct ordering
  const sessions = (data as any)?.pages
    ? (data as any).pages.flatMap((page: any) => page.sessions)
    : [];

  const isMobile = down("sm");

  const handleEditModeToggle = () => {
    setIsEditingMode(!isEditingMode);
  };

  const handleActionButtonPress = () => {
    if (isEditingMode) {
      setIsDeleteModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const hasSessions = sessions?.length > 0 && !isLoadingSessions;

  const actions = (
    <div className="flex gap-2 sm:flex-row justify-between sm:justify-end flex-1">
      {hasSessions && (
        <Button
          size={isMobile ? "sq-sm" : "sm"}
          intent={isEditingMode ? "primary" : "secondary"}
          onPress={handleEditModeToggle}
          isDisabled={isLoadingSessions}
        >
          {isEditingMode ? (
            <>
              <HugeiconsIcon icon={Tick01Icon} size={16} data-slot="icon" />
              {!isMobile && <span>Done</span>}
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Pen01Icon} size={16} data-slot="icon" />
              {!isMobile && <span>Edit</span>}
            </>
          )}
        </Button>
      )}

      <Button
        intent={isEditingMode ? "danger" : "primary"}
        onPress={handleActionButtonPress}
        className={"w-full sm:w-fit"}
        size="sm"
        isDisabled={isEditingMode && selectedSessions.length === 0}
      >
        <HugeiconsIcon
          icon={CalendarAdd02Icon}
          altIcon={DeleteIcon}
          showAlt={isEditingMode}
          size={16}
          data-slot="icon"
        />
        <p>{isEditingMode ? "Delete sessions" : "Add session"}</p>
      </Button>
    </div>
  );

  return (
    <>
      <div className="min-h-0">
        <HubPanelHeader title="Sessions timeline" actions={actions} />
        {sessions?.length !== 0 && !isLoadingSessions && (
          <Button
            intent="plain"
            size="xs"
            className="mb-4"
            onPress={() => fetchPreviousPage()}
            isDisabled={!hasPreviousPage || isFetchingPreviousPage}
          >
            {isFetchingPreviousPage ? "Loading..." : "Show past sessions"}
          </Button>
        )}

        {sessions?.length === 0 && !isLoadingSessions && (
          <EmptyState
            title="No upcoming sessions"
            description="Create your next session to see it here. Past sessions can be
            viewed using the 'Show past sessions' button above."
            icon={Calendar02Icon}
            action={
              <Button intent="primary" onPress={() => setIsAddModalOpen(true)}>
                Create session
              </Button>
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
                    position={index + 1}
                    hubId={hubId}
                  />
                </m.div>
              );
            })}
          </LayoutGroup>
        )}

        {/* Infinite scroll trigger */}

        {hasNextPage && (
          <div className="flex justify-center py-2 pb-4">
            <Button
              intent="plain"
              onPress={() => fetchNextPage()}
              isPending={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <Loader size="sm" intent="secondary" />
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
      </div>
      <DynamicAddSessionsFormModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        hubId={hubId}
        disableHubSelection={true}
      />
      <DynamicDeleteSessionsModal hubId={hubId} />
    </>
  );
}
