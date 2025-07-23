"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Tooltip } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";

export interface AgendaSessionData {
  id: number | string;
  startTime: string;
  endTime: string;
  hub?: {
    id: number | string;
    name: string;
    color?: CustomColor;
  } | null;
  students: Array<{
    id: number | string;
    name: string;
  }>;
}

export interface AgendaSessionCardProps {
  session: AgendaSessionData;
}

/**
 * Reusable session card component for displaying session information
 * in agenda views across the application
 */
export const AgendaSessionCard = ({ session }: AgendaSessionCardProps) => {
  const color = getCustomColorClasses(session.hub?.color ?? "neutral");
  const numberOfStudents = session.students?.length ?? 0;

  return (
    <div className="flex flex-row gap-3 p-1">
      <div className="flex flex-col gap-1 shrink-0">
        <p className="text-sm font-medium tabular-nums">
          {format(session.startTime, "hh:mm a")}
        </p>
        <p className="text-xs text-muted-fg tabular-nums">
          {format(session.endTime, "hh:mm a")}
        </p>
      </div>
      <div
        className={cn(
          "rounded-lg w-1 shrink-0 min-w-0 min-h-0 border",
          color?.bg,
          color?.border,
        )}
      />

      <div className="space-y-1.5">
        <p className="text-sm line-clamp-1 font-medium leading-tight">
          {session.hub?.name ?? "Untitled"}
        </p>
        <div className="flex flex-row items-center gap-1.5">
          {numberOfStudents > 0 ? (
            <Tooltip delay={0} closeDelay={0}>
              <Tooltip.Trigger className="flex items-center gap-1 text-muted-fg">
                <HugeiconsIcon icon={UserIcon} size={12} />
                <p className="text-xs">{numberOfStudents} students</p>
              </Tooltip.Trigger>
              <Tooltip.Content
                placement="right"
                className="flex flex-col gap-1"
              >
                {session.students.map((student) => (
                  <p key={student.id} className="text-xs">
                    {student.name}
                  </p>
                ))}
              </Tooltip.Content>
            </Tooltip>
          ) : (
            <p className="flex items-center gap-1 text-muted-fg">
              <HugeiconsIcon icon={UserIcon} size={12} />
              <span className="text-xs">No students</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyAgendaSessionCard = () => {
  return (
    <p className="p-4 text-sm text-muted-fg italic text-center text-balance">
      No sessions scheduled for this period
    </p>
  );
};
