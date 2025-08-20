"use client";

import { differenceInMinutes, format } from "date-fns";

import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import { AvatarStack } from "../ui/avatar-stack";

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
  showStudentTooltips?: boolean;
}

/**
 * Calculate duration between start and end time in hours and minutes
 */
const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalMinutes = differenceInMinutes(end, start);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

/**
 * Reusable session card component for displaying session information
 * in agenda views across the application
 */
export const AgendaSessionCard = ({
  session,
  showStudentTooltips = true,
}: AgendaSessionCardProps) => {
  const color = getCustomColorClasses(session.hub?.color ?? "neutral");
  const numberOfStudents = session.students?.length ?? 0;
  const duration = calculateDuration(session.startTime, session.endTime);

  return (
    <div className="flex flex-row gap-2 p-1">
      <div className="flex flex-col gap-1 shrink-0 p-0.5 w-18">
        <p className="text-sm font-medium tabular-nums">
          {format(new Date(session.startTime), "HH:mm")}
        </p>
        <p className="text-xs text-muted-fg tabular-nums">{duration}</p>
      </div>
      <div
        className={cn("rounded-lg w-1 shrink-0 min-w-0 min-h-0", color?.dot)}
      />

      <div className="space-y-1.5 p-0.5">
        {session.hub ? (
          <p className="text-sm line-clamp-1 font-medium leading-tight">
            {session.hub.name}
          </p>
        ) : (
          <p className="text-sm line-clamp-1 font-medium leading-tight">
            Untitled
          </p>
        )}
        <div className="flex flex-row items-center gap-1.5">
          {numberOfStudents > 0 && (
            <AvatarStack
              users={session.students.map((student) => ({
                id: student.id,
                name: student.name,
                image: null,
              }))}
              size="sm"
              spacing="loose"
              maxAvatars={5}
              showTooltips={showStudentTooltips}
              className={{ avatar: "outline-overlay outline-2" }}
            />
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
