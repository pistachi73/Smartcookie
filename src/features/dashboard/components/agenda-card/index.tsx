"use client";

import { useState } from "react";
import { Temporal } from "temporal-polyfill";

import { buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
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
      <Card.Header>
        <Card.Title>Schedule</Card.Title>
        <Card.Description>Showing events for the next 7 days</Card.Description>
        <Card.Action>
          <Link
            href="/portal/calendar"
            className={buttonStyles({
              intent: "outline",
              size: "sm",
            })}
          >
            See all
          </Link>
        </Card.Action>
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
