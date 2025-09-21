"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Temporal } from "temporal-polyfill";

import { buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-card-skeleton";

import { AgendaWeekPicker } from "./agenda-week-picker";

export const AgendaCardSkeleton = () => {
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
              size: "sq-sm",
            })}
          >
            <HugeiconsIcon icon={LinkSquare02Icon} data-slot="icon" size={14} />
          </Link>
        </Card.Action>
      </Card.Header>

      <Card.Content className="space-y-4">
        <AgendaWeekPicker date={Temporal.Now.plainDateISO()} />
        <div className="space-y-4 w-full min-w-0">
          <div className="space-y-2 w-full min-w-0">
            {Array.from({ length: 3 }, (_, i) => (
              <AgendaSessionCardSkeleton key={`agenda-card-skeleton-${i}`} />
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
