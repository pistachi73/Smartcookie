import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarRemove01Icon,
  Tick01Icon,
  Tick02Icon,
  TimeScheduleIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import * as m from "motion/react-m";
import { Checkbox } from "react-aria-components";
import { tv } from "tailwind-variants";

import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import { useSessionStore } from "../../store/session-store";
import type { HubSession } from "../../types/hub.types";

export const sessionBubbleStyles = tv({
  base: [
    "transition-colors",
    "flex items-center justify-center shrink-0",
    "size-7 @md:size-8 rounded-full bg-primary border",
  ],
  variants: {
    status: {
      completed: [
        "bg-green-400 text-green-950 border-green-700 dark:bg-green-900 dark:text-green-200",
      ],
      upcoming:
        "bg-blue-400 text-blue-950 border-blue-700 dark:bg-blue-900/50 dark:text-blue-100",
      cancelled: [
        "bg-red-400 text-red-950 border-red-700 dark:bg-red-900/50 dark:text-red-100",
      ],
    },
  },
  defaultVariants: {
    status: "upcoming",
  },
});

const MotionCheckbox = m.create(Checkbox);

type SessionBubbleProps = {
  session: HubSession;
  className?: string;
};
export const SessionBubble = ({ session, className }: SessionBubbleProps) => {
  const isEditing = useSessionStore((store) => store.isEditingMode);
  const isSelected = useSessionStore((store) =>
    store.selectedSessions.some(
      (selectedSession) => selectedSession.id === session.id,
    ),
  );
  const handleSessionSelection = useSessionStore(
    (store) => store.toggleSessionSelection,
  );
  const sessionId = session.id;

  const Icon =
    session.status === "completed"
      ? Tick01Icon
      : session.status === "cancelled"
        ? CalendarRemove01Icon
        : TimeScheduleIcon;

  if (isEditing) {
    return (
      <MotionCheckbox
        layout
        transition={{
          layout: regularSpring,
        }}
        className={cn(className, "relative h-fit")}
        isSelected={isSelected}
        onChange={(isSelected) => {
          console.log({ id: sessionId, startTime: session.startTime });
          handleSessionSelection?.(
            {
              id: sessionId,
              startTime: session.startTime,
              endTime: session.endTime,
            },
            isSelected,
          );
        }}
      >
        {({ isSelected, isFocusVisible }) => (
          <div
            className={cn([
              "relative",
              "flex items-center justify-center shrink-0",
              "size-7 sm:size-8 rounded-full bg-primary border",
              isEditing && "bg-bg dark:bg-overlay-highlight border-border",
              isSelected && "bg-primary-tint! text-primary border-primary",
              isFocusVisible && "ring-2 ring-primary/30 border-primary",
            ])}
          >
            {isSelected ? (
              <m.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  mass: 0.1,
                }}
              >
                <HugeiconsIcon
                  icon={Tick02Icon}
                  data-slot="icon"
                  className="size-3 @md:size-4"
                />
              </m.div>
            ) : null}
          </div>
        )}
      </MotionCheckbox>
    );
  }

  return (
    <m.div
      layout
      transition={{
        layout: regularSpring,
      }}
      className={cn(
        sessionBubbleStyles({
          status: session.status,
          className,
        }),
      )}
    >
      <HugeiconsIcon
        icon={Icon}
        strokeWidth={1.5}
        className="size-3 @md:size-4"
      />
    </m.div>
  );
};
