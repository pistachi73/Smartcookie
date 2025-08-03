import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
  Tick01Icon,
  TimeScheduleIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Card } from "@/shared/components/ui/card";
import { Carousel } from "@/shared/components/ui/carousel";

import type { getInfiniteSessionsByHubId } from "@/data-access/sessions/queries";
import type { HubOverviewSession } from "@/features/hub/types/hub.types";
import { cn } from "@/lib/utils";
import { ViewMoreSessionsCard } from "./view-more-sessions-card";

interface SessionTimelineItemProps {
  session: NonNullable<HubOverviewSession>;
  index: number;
}

const SESSION_STYLES = {
  completed: {
    icon: Tick01Icon,
    iconBg: "bg-success/60 text-success-fg",
    cardBg: "border-success/60 bg-success/10",
    accent: "border-t-success/60",
    dotColor: "bg-success",
    connector: "bg-gradient-to-r from-success/60 to-primary",
    badgeText: "Class Notes",
  },
  upcoming: {
    icon: TimeScheduleIcon,
    iconBg: "bg-primary text-primary-fg",
    cardBg: "border-primary bg-primary/10",
    accent: "border-t-primary",
    dotColor: "bg-primary",
    connector: "bg-gradient-to-r from-primary to-secondary",
    badgeText: "Session Plans",
  },
  future: {
    icon: Calendar01Icon,
    iconBg: "bg-secondary text-secondary-fg",
    cardBg: "border-secondary bg-muted/70",
    accent: "border-t-secondary",
    dotColor: "bg-secondary",
    connector: "bg-secondary",
    badgeText: "Session Plans",
  },
} as const;

const getSessionStatus = (index: number) => {
  if (index === 0) return "completed";
  if (index === 1) return "upcoming";
  return "future";
};

const SessionTimelineItem = ({ session, index }: SessionTimelineItemProps) => {
  const sessionStartTime = new Date(session.startTime);
  const status = getSessionStatus(index);
  const styles = SESSION_STYLES[status];

  return (
    <Card
      className={cn(
        "relative w-full border-t-4 h-full",
        styles.cardBg,
        styles.accent,
      )}
      spacing="sm"
    >
      <Card.Header className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center shrink-0 size-8 rounded-full",
            styles.iconBg,
          )}
        >
          <HugeiconsIcon icon={styles.icon} className="size-4" />
        </div>
        <div className="space-y-0.5">
          <Card.Title className="text-base font-semibold">
            {format(sessionStartTime, "EEEE, MMM d")}
          </Card.Title>
          <Card.Description className="flex items-center gap-1 text-sm text-muted-fg tabular-nums">
            <HugeiconsIcon icon={Clock01Icon} size={12} />
            <span>{format(sessionStartTime, "h:mm a")}</span>
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content className="pt-2 flex-1">
        <div className="space-y-3 h-full">
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", styles.dotColor)} />
            <p className="text-xs font-semibold text-fg uppercase">
              {styles.badgeText}
            </p>
          </div>

          <div className="space-y-2">
            {session.notes && session.notes.length > 0 ? (
              session.notes.slice(0, 2).map((note) => (
                <div
                  key={note.id}
                  className="text-sm p-3 rounded-lg border border-border/50 bg-white"
                >
                  {note.content}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-fg italic p-2">
                {status === "completed"
                  ? "No notes taken"
                  : "No plans added yet"}
              </div>
            )}

            {session.notes && session.notes.length > 2 && (
              <div className="text-xs text-muted-fg text-center pt-1">
                +{session.notes.length - 2} more notes
              </div>
            )}
          </div>
        </div>
      </Card.Content>

      <div
        className={cn("absolute left-full top-10 h-px w-6", styles.connector)}
      />
    </Card>
  );
};

export const SessionTimelineCarrousel = ({
  sessions,
  goToSessions,
}: {
  sessions: Awaited<ReturnType<typeof getInfiniteSessionsByHubId>>["sessions"];
  goToSessions: () => void;
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      spacing="md"
      className="w-full"
    >
      <Carousel.Content>
        {sessions.map((session, index) => (
          <Carousel.Item
            key={session.id}
            className="basis-1/2 @2xl:basis-1/3 @4xl:basis-1/4"
          >
            <SessionTimelineItem session={session} index={index} />
          </Carousel.Item>
        ))}
        <Carousel.Item className="basis-1/3 @2xl:basis-1/4 @4xl:basis-1/6">
          <ViewMoreSessionsCard onViewMore={goToSessions} />
        </Carousel.Item>
      </Carousel.Content>

      <Carousel.Handler>
        <Carousel.Button segment="previous" />
        <Carousel.Button segment="next" />
      </Carousel.Handler>
    </Carousel>
  );
};
