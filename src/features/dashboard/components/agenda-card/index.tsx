"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Settings01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { addDays, format, subDays } from "date-fns";
import { useState } from "react";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { Menu } from "@/shared/components/ui/menu";
import { Separator } from "@/shared/components/ui/separator";
import {
  AgendaSessionCard,
  EmptyAgendaSessionCard,
} from "@/shared/components/sessions/agenda-session-card";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-skeleton";

import { useGetAgendaSessions } from "../../hooks/use-get-agenda-sessions";
import { transformToAgendaSessionData } from "../../lib/transform-agenda-data";

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
  const [dateRange, setDateRange] = useState(7);
  const [dateInterval, setDateInterval] = useState<[Date, Date]>([
    new Date(),
    addDays(new Date(), 6),
  ]);
  const { data: rawAgendaSessions, isPending } =
    useGetAgendaSessions(dateInterval);

  const agendaSessions = transformToAgendaSessionData(rawAgendaSessions ?? {});

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
              ? format(dateInterval[0], "dd MMM")
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
                  <AgendaSessionCardSkeleton key={`skeleton-agenda-${index}`} />
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
