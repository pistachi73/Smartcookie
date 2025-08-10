"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";
import { useState } from "react";
import { Temporal } from "temporal-polyfill";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-card-skeleton";

import { DaySessions } from "@/features/calendar/components/upcoming-sessions";
import {
  useOptimizedCalendarSessions,
  useOptimizedDaySessions,
} from "@/features/calendar/hooks/use-optimized-calendar-sessions";

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

  const onNext = () => {
    setDate((date) => date.add({ days: 7 }));
  };

  const onYesterday = () => {
    setDate((date) => date.subtract({ days: 7 }));
  };

  const next7Days = Array.from({ length: 7 }, (_, i) => date.add({ days: i }));

  return (
    <Card className="h-full">
      <Card.Header>
        <Card.Title>Schedule</Card.Title>
        <Card.Description>Showing events for the next 7 days</Card.Description>
        <Card.Action>
          <Link
            href="/portal/calendar"
            className={buttonStyles({
              intent: "outline",
              size: "small",
            })}
          >
            See all
          </Link>
        </Card.Action>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-2 p-1 bg-secondary dark:bg-overlay-highlight rounded-lg">
          <Button
            intent="plain"
            size="square-petite"
            className={"size-7 bg-overlay dark:bg-overlay-elevated"}
            onPress={onYesterday}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          </Button>
          <p className="text-sm font-medium flex-1 text-center tabular-nums">
            {next7Days[0] && format(next7Days[0].toString(), "dd MMM yyyy")} -{" "}
            {next7Days[6] && format(next7Days[6].toString(), "dd MMM yyyy")}
          </p>
          <Button
            intent="plain"
            size="square-petite"
            className={"size-7 bg-overlay  dark:bg-overlay-elevated"}
            onPress={onNext}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              strokeWidth={2}
              className="font-semibold"
            />
          </Button>
        </div>

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
