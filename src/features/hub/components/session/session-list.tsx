"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarAdd02Icon,
  DeleteIcon,
  Pen01Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
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
  } = useInfiniteQuery(getPaginatedSessionsByHubIdQueryOptions(hubId));

  console.log({ data });

  // Flatten all sessions from all pages
  // Type assertion to handle infinite query data structure
  const sessions = (data as any)?.pages
    ? (data as any).pages.flatMap((page: any) => page.sessions)
    : [];

  const { down } = useViewport();
  const isMobile = down("sm");

  // Infinite scroll hook for loading more sessions
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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

  const actions = (
    <div className="flex gap-2 sm:flex-row justify-between sm:justify-end flex-1">
      <Button
        shape="square"
        size={isMobile ? "square-petite" : "small"}
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

      <Button
        shape="square"
        intent={isEditingMode ? "danger" : "primary"}
        onPress={handleActionButtonPress}
        className={"w-full sm:w-fit"}
        size="small"
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

        <Button
          intent="plain"
          size="extra-small"
          className="mb-4"
          onPress={() => fetchPreviousPage()}
          isDisabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          {isFetchingPreviousPage ? "Loading..." : "Show older sessions"}
        </Button>
        {sessions?.length === 0 && (
          <div className="border bg-bg dark:bg-overlay-highlight rounded-lg border-dashed flex flex-col items-center justify-center w-full h-full p-6">
            <Heading level={3} className="mb-1">
              No sessions created yet
            </Heading>
            <p className="text-muted-fg text-center max-w-xs">
              Create your first session to start tracking your tutoring
              activities.
            </p>
          </div>
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
        <div ref={loadMoreRef} className="py-4">
          {isFetchingNextPage && (
            <div className="text-center">
              <SessionSkeleton />
            </div>
          )}
        </div>
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
