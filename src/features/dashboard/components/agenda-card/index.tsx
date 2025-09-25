"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";
import { Temporal } from "temporal-polyfill";

import { buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-card-skeleton";

import { DaySessions } from "@/features/calendar/components/upcoming-sessions";
import {
  useOptimizedCalendarSessions,
  useOptimizedDaySessions,
} from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import { AgendaWeekPicker } from "./agenda-week-picker";

export const AgendaCard = () => {
  useOptimizedCalendarSessions();

  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  useOptimizedCalendarSessions({
    viewType: "week",
    date,
  });
  const { isLoading } = useOptimizedDaySessions(date);

  const next7Days = Array.from({ length: 7 }, (_, i) => date.add({ days: i }));

  return (
    <Card className="min-h-full overflow-auto @4xl:h-0 w-full">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title>Agenda</Card.Title>

        <Tooltip delay={200} closeDelay={0}>
          <Link
            href="/portal/calendar"
            className={buttonStyles({
              intent: "outline",
              size: "sq-xs",
            })}
          >
            <HugeiconsIcon icon={LinkSquare02Icon} size={14} />
          </Link>
          <Tooltip.Content intent="inverse">View calendar</Tooltip.Content>
        </Tooltip>
      </Card.Header>
      <Card.Content className="space-y-4">
        <AgendaWeekPicker date={date} setDate={setDate} />

        <div className="space-y-4 w-full min-w-0">
          {isLoading ? (
            <div className="space-y-2 w-full min-w-0">
              {Array.from({ length: 3 }, (_, i) => (
                <AgendaSessionCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            next7Days.map((date) => (
              <DaySessions key={date.toString()} date={date} />
            ))
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
