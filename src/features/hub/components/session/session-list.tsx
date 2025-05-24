import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Switch } from "@/shared/components/ui/switch";
import { regularSpring } from "@/shared/lib/animation";
import {
  CalendarAdd02Icon,
  DeleteIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
import { useSessionsByHubId } from "../../hooks/session/use-sessions-by-hub-id";
import { useSessionStore } from "../../store/session-store";
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
  } = useSessionStore(
    useShallow((store) => ({
      isEditingMode: store.isEditingMode,
      selectedSessions: store.selectedSessions,
      setIsEditingMode: store.setIsEditingMode,
      setIsAddModalOpen: store.setIsAddModalOpen,
      setIsDeleteModalOpen: store.setIsDeleteModalOpen,
    })),
  );

  const { data: sessions, isPending: isLoadingSessions } =
    useSessionsByHubId(hubId);

  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <>
      <div className="min-h-0">
        <div className="flex flex-row items-center justify-between mb-8 flex-wrap gap-3">
          <Heading level={2}>Sessions timeline</Heading>
          <div className="flex gap-2  sm:flex-row justify-between sm:justify-end flex-1">
            <Switch
              isSelected={isEditingMode}
              onChange={setIsEditingMode}
              size="medium"
              className="flex-row-reverse gap-2 text-muted-fg"
              isDisabled={isLoadingSessions}
            >
              Edit mode
            </Switch>

            <Button
              shape="square"
              size="small"
              intent={isEditingMode ? "danger" : "primary"}
              onPress={() => {
                if (isEditingMode) {
                  setIsDeleteModalOpen(true);
                } else {
                  setIsAddModalOpen(true);
                }
              }}
              className={"w-[160px]"}
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
        </div>

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
            <SessionSkeleton
              key={`session-skeleton-${index}`}
              position={index + 1}
            />
          ))
        ) : (
          <LayoutGroup>
            {sessions?.map((session, index) => {
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
      </div>
      <DynamicAddSessionsFormModal hubId={hubId} />
      <DynamicDeleteSessionsModal hubId={hubId} />
    </>
  );
}
