import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import { getQueryClient } from "@/shared/lib/get-query-client";
import {
  ArrowDown01Icon,
  Clock01Icon,
  PropertyEditIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { getSessionNotesBySessionIdQueryOptions } from "../../lib/session-notes-query-options";
import { useSessionStore } from "../../store/session-store";
import type { HubSession } from "../../types/hub.types";
import { SessionBubble } from "./session-bubble";
import { SessionNoteColumn } from "./session-notes/session-note-column";

const DynamicUpdateSessionFormModal = dynamic(
  () =>
    import("./update-session-form-modal").then(
      (mod) => mod.UpdateSessionFormModal,
    ),
  {
    ssr: false,
  },
);

export const DesktopSessionBubble = ({
  session,
  index,
  totalSessions,
}: { index: number; session: HubSession; totalSessions: number }) => {
  return (
    <m.div
      layout
      transition={{
        layout: regularSpring,
      }}
      className={cn(
        "flex  justify-center relative",
        "before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-2.5 before:shrink-0",
        "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-[calc(100%-var(--spacing)*9.5)]",
        index === 0
          ? "before:bg-transparent"
          : "before:bg-bg dark:before:bg-overlay-highlight",
        index === totalSessions - 1
          ? "after:bg-transparent"
          : "after:bg-bg dark:after:bg-overlay-highlight",
      )}
    >
      <SessionBubble session={session} className="mt-2.5 z-10" />
    </m.div>
  );
};

type SessionProps = {
  hubId: number;
  session: HubSession;
  position: number;
};

const MotionButton = m.create(Button);

export const Session = ({ session, position, hubId }: SessionProps) => {
  const queryClient = getQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const isEditingMode = useSessionStore((store) => store.isEditingMode);

  const prefecthSesionNotes = useCallback(() => {
    queryClient.prefetchQuery({
      ...getSessionNotesBySessionIdQueryOptions(session.id),
      staleTime: 60000,
    });
  }, [queryClient, session.id]);

  const onEditSession = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  const { isLoading: isLoadingSessionNotes } = useQuery({
    ...getSessionNotesBySessionIdQueryOptions(session.id),
    enabled: isExpanded,
  });

  console.log({
    sessionStartTime: session.startTime,
    sessionEndTime: session.endTime,
  });

  return (
    <>
      <div
        className={cn(
          "border rounded-lg flex-1 mb-2 sm:mb-4 shadow-sm bg-overlay transition-shadow",
          isExpanded && "shadow-md",
        )}
      >
        <m.div
          layout
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          className={cn(
            buttonStyles({ intent: "plain" }),
            "group p-2 sm:p-1 sm:pr-4 h-auto flex w-full items-center flex-row gap-2 transition-all justify-between ",
            isExpanded && "bg-muted rounded-b-none",
            "transition-colors",
          )}
          onHoverStart={prefecthSesionNotes}
          onFocus={prefecthSesionNotes}
        >
          <div className="flex flex-row items-center gap-4">
            <m.div
              layout
              className={cn(
                "hidden sm:flex transition-colors flex-col items-center justify-center size-12 bg-bg dark:bg-overlay-highlight rounded-sm",
                isExpanded && "bg-overlay-highlight dark:bg-overlay-elevated",
              )}
            >
              <p className="text-xs text-muted-fg">
                {format(session.startTime, "MMM")}
              </p>
              <p className="text-base font-semibold">
                {format(session.startTime, "dd")}
              </p>
            </m.div>

            <SessionBubble session={session} className="flex sm:hidden" />

            <Heading level={3} className="text-base font-medium">
              Session {position}
            </Heading>
            <Separator orientation="vertical" className="h-4" />
            <p className="text-sm text-muted-fg flex flex-row items-center gap-1">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={14}
                className="hidden sm:block"
              />
              {format(session.startTime, "HH:mm")} -{" "}
              {format(session.endTime, "HH:mm")}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {isEditingMode && (
              <div className="flex gap-1 items-center">
                <Button
                  intent="plain"
                  size="square-petite"
                  className="size-9"
                  onPress={onEditSession}
                >
                  <HugeiconsIcon icon={PropertyEditIcon} size={16} />
                </Button>
              </div>
            )}
            <div className="size-9 flex items-center justify-center">
              {isLoadingSessionNotes && isExpanded ? (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Loading session notes"
                  className="size-4"
                />
              ) : (
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                  size={16}
                />
              )}
            </div>
          </div>
        </m.div>

        <AnimatePresence>
          {isExpanded && !isLoadingSessionNotes && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={regularSpring}
              className="overflow-hidden"
            >
              <div className="p-2 flex flex-col sm:grid sm:grid-rows-1 sm:grid-cols-3">
                <SessionNoteColumn position="past" sessionId={session.id} />
                <SessionNoteColumn position="present" sessionId={session.id} />
                <SessionNoteColumn position="future" sessionId={session.id} />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <DynamicUpdateSessionFormModal
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        session={session}
        hubId={hubId}
      />
    </>
  );
};
