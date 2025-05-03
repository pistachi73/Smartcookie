"use client";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { Menu } from "@/shared/components/ui/menu";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { addDays, format, subDays } from "date-fns";
import { useState } from "react";
import { useGetAgendaSessions } from "../../hooks/use-get-agenda-sessions";
import type { getAgendaSessionsUseCase } from "../../use-cases/dashboard.use-case";
import { SkeletonAgendaSessionCard } from "./skeleton-agenda-card";

const agendaDateRanges: { label: string; value: number }[] = [
  {
    label: "1 Day",
    value: 1,
  },
  {
    label: "3 Days",
    value: 3,
  },
  {
    label: "Week",
    value: 7,
  },
];

export const AgendaCard = () => {
  const [dateRange, setDateRange] = useState(1);
  const [dateInterval, setDateInterval] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);
  const { data: agendaSessions, isPending } =
    useGetAgendaSessions(dateInterval);

  const onNext = () => {
    const startDate = addDays(dateInterval[0], dateRange);
    const endDate = addDays(dateInterval[1], dateRange);
    setDateInterval([startDate, endDate]);
  };

  const onYesterday = () => {
    const startDate = subDays(dateInterval[0], dateRange);
    const endDate = subDays(dateInterval[1], dateRange);
    setDateInterval([startDate, endDate]);
  };

  const onDateRangeChange = (newRange: number) => {
    const currentRange = dateRange;
    const rangeDiff = newRange - currentRange;
    setDateRange(newRange);
    setDateInterval([dateInterval[0], addDays(dateInterval[1], rangeDiff)]);
  };

  const agendaSessionTotalDays = Object.keys(agendaSessions ?? {}).length;

  return (
    <Card className="h-full">
      <Card.Header className="flex flex-row items-center justify-between">
        <Heading level={4} className="text-base font-semibold">
          Schedule
        </Heading>
        <div className="flex flex-row gap-2">
          <Link
            href="/portal/calendar"
            className={buttonStyles({
              intent: "outline",
              size: "extra-small",
            })}
          >
            See all
          </Link>
          <Menu>
            <Button intent="outline" size="square-petite" className="size-8">
              <HugeiconsIcon icon={Settings01Icon} size={14} strokeWidth={2} />
            </Button>
            <Menu.Content
              placement="bottom end"
              selectionMode="single"
              selectedKeys={dateRange.toString()}
            >
              <Menu.Header separator>
                <span className="block">Schedule range</span>
              </Menu.Header>
              {agendaDateRanges.map((item) => (
                <Menu.Item
                  key={`agenda-date-range-${item.value}`}
                  textValue={item.label}
                  onAction={() => onDateRangeChange(item.value)}
                  className="flex items-center justify-between gap-2"
                >
                  <Menu.Label>{item.label}</Menu.Label>
                  {dateRange === item.value && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-2 p-1 bg-bg dark:bg-overlay-highlight rounded-lg">
          <Button
            intent="plain"
            size="square-petite"
            className={"size-7 bg-overlay dark:bg-overlay-elevated"}
            onPress={onYesterday}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          </Button>
          <p className="text-sm font-medium flex-1 text-center tabular-nums">
            {dateRange === 1
              ? format(dateInterval[0], "dd MMM yyyy")
              : `${format(dateInterval[0], "dd MMM yyyy")} - ${format(dateInterval[1], "dd MMM yyyy")}`}
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
        <div className="flex flex-col gap-6 min-h-[350px] overflow-y-auto">
          {isPending ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <>
                  <SkeletonAgendaSessionCard key={`skeleton-agenda-${index}`} />
                  {index < 4 && <Separator />}
                </>
              ))}
            </div>
          ) : agendaSessions && agendaSessionTotalDays > 0 ? (
            Object.entries(agendaSessions).map(([day, sessions], dayIndex) => {
              return (
                <section
                  key={`agenda-session-${day}`}
                  className="flex flex-col gap-2"
                >
                  <p className="text-muted-fg text-sm font-medium tabular-nums">
                    {format(new Date(day), "dd MMM yyyy")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {sessions.map((session, index) => (
                      <>
                        <AgendaSessionCard
                          key={`agenda-session-${session.id}`}
                          session={session}
                        />
                        {(index !== sessions.length - 1 ||
                          dayIndex !== agendaSessionTotalDays - 1) && (
                          <Separator />
                        )}
                      </>
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <EmptyAgendaSessionCard />
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

const AgendaSessionCard = ({
  session,
}: {
  session: Awaited<ReturnType<typeof getAgendaSessionsUseCase>>[string][number];
}) => {
  const color = getCustomColorClasses(session.hub?.color);
  const numberOfStudents = session.students?.length;

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
          " rounded-lg w-1 shrink-0 min-w-0 min-h-0 border",
          color?.bg,
          color?.border,
        )}
      />

      <div className="space-y-1.5">
        <p className="text-sm line-clamp-1 font-medium leading-tight">
          {session.hub?.name ?? "Untitled"}
        </p>
        <div className="flex flex-row items-center gap-1.5  ">
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

const EmptyAgendaSessionCard = () => {
  return (
    <p className="p-4 text-sm text-muted-fg italic text-center text-balance">
      No sessions scheduled for this period
    </p>
  );
};
