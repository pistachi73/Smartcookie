"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Delete02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";

import { useHubFormStore } from "../../../store/hub-form-store";

export function SessionsList() {
  const sessions = useHubFormStore((state) => state.sessions);
  const removeSession = useHubFormStore((state) => state.removeSession);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            className="text-muted-fg"
          />
        </div>
        <Heading level={4} className="font-medium text-foreground mb-1">
          No sessions scheduled
        </Heading>
        <p className="text-sm text-muted-fg">
          Add your first session to get started with scheduling.
        </p>
      </div>
    );
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Sort sessions by start time
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div className="space-y-3">
      {sortedSessions.map((session, index) => {
        const startDate = new Date(session.startTime);
        const endDate = new Date(session.endTime);

        return (
          <div
            key={`${session.startTime}-${index}`}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border bg-card",
              "hover:bg-muted transition-colors",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-medium">
                  {format(startDate, "MMM")}
                </span>
                <span className="text-sm font-bold">
                  {format(startDate, "dd")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={14}
                    className="text-muted-foreground"
                  />
                  {format(startDate, "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                  </div>

                  <Badge intent="secondary" shape="square">
                    {formatDuration(session.startTime, session.endTime)}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              size="sq-sm"
              intent="danger"
              className="text-danger hover:bg-danger/10 bg-transparent"
              onPress={() => {
                // Since sessions from calculateRecurrentSessions don't have IDs,
                // we'll remove by index for now
                const sessionIndex = sessions.findIndex(
                  (s) =>
                    s.startTime === session.startTime &&
                    s.endTime === session.endTime,
                );
                if (sessionIndex !== -1) {
                  removeSession(sessionIndex);
                }
              }}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
