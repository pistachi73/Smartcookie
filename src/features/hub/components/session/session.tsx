import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import {
  ArrowDown01Icon,
  Calendar03Icon,
  Tick02Icon,
  TimeScheduleIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { Button as RAButton } from "react-aria-components";
import { useSessionNotes } from "../../hooks/session-notes/use-session-notes";
import type { HubSession } from "../../types/hub.types";
import { SessionNoteColumn } from "./session-note-column";

type SessionProps = {
  session: HubSession;
  position: number;
};

const MotionRAButton = m.create(RAButton);

export const Session = ({ session, position }: SessionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: sessionNotes } = useSessionNotes({
    sessionId: session.id,
  });

  return (
    <div className="border rounded-lg flex-1 mb-2 sm:mb-4">
      <MotionRAButton
        layout
        className={cn(
          "group rounded-lg cursor-pointer w-full flex flex-row items-center justify-between p-2 sm:p-1 sm:pr-4",
          "transition-colors duration-200 hover:bg-overlay border-b border-transparent",
          isExpanded && "border-border bg-overlay rounded-b-none",
        )}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-row items-center gap-4">
          <m.div
            layout
            className={cn(
              "hidden sm:flex group-hover:bg-overlay-elevated-highlight transition-colors flex-col items-center justify-center size-14 bg-overlay rounded-sm",
              isExpanded && "bg-overlay-elevated-highlight",
            )}
          >
            <p className="text-sm text-muted-fg">
              {format(session.startTime, "EEE")}
            </p>
            <p className="text-lg font-semibold">
              {format(session.startTime, "d")}
            </p>
          </m.div>
          <div
            className={cn(
              "sm:hidden flex items-center justify-center shrink-0",
              "size-8 rounded-full bg-primary",
              session.status === "completed" && "bg-green-900 text-green-200",
              session.status === "upcoming" && "bg-blue-900/50 text-blue-100",
            )}
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              altIcon={TimeScheduleIcon}
              showAlt={session.status === "upcoming"}
              size={16}
              strokeWidth={1.5}
            />
          </div>
          <Heading level={3} className="text-sm font-medium">
            Session {position}
          </Heading>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-muted-fg flex flex-row items-center gap-1">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={14}
              className="hidden sm:block"
            />
            {format(session.startTime, "EEE, MMM d, yyyy")}
          </p>
        </div>

        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            "transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
          size={16}
        />
      </MotionRAButton>

      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={regularSpring}
            className="overflow-hidden"
          >
            <div className="p-2 flex flex-col sm:grid sm:grid-rows-1 sm:grid-cols-3">
              <SessionNoteColumn
                position="past"
                notes={sessionNotes?.past}
                sessionId={session.id}
              />
              <SessionNoteColumn
                position="present"
                notes={sessionNotes?.present}
                sessionId={session.id}
              />
              <SessionNoteColumn
                position="future"
                notes={sessionNotes?.future}
                sessionId={session.id}
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
