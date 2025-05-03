"use client";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Settings01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import React from "react";

export const SkeletonAgendaCard = () => {
  const now = new Date();

  return (
    <Card>
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
          <Button intent="outline" size="square-petite" className="size-8">
            <HugeiconsIcon icon={Settings01Icon} size={14} strokeWidth={2} />
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-2 p-1 bg-bg dark:bg-overlay-highlight rounded-lg">
          <Button
            intent="plain"
            size="square-petite"
            className={"size-7 bg-overlay dark:bg-overlay-elevated"}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          </Button>
          <p className="text-sm font-medium flex-1 text-center tabular-nums">
            {format(now, "dd MMM yyyy")}
          </p>
          <Button
            intent="plain"
            size="square-petite"
            className={"size-7 bg-overlay  dark:bg-overlay-elevated"}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              strokeWidth={2}
              className="font-semibold"
            />
          </Button>
        </div>
        <div className="flex flex-col gap-2 h-[350px] overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <React.Fragment key={`skeleton-agenda-${index}`}>
              <SkeletonAgendaSessionCard />
              {index < 4 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export const SkeletonAgendaSessionCard = () => {
  return (
    <div className="flex flex-row gap-3 p-1">
      <div className="flex flex-col gap-1 shrink-0">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="w-1 shrink-0 min-w-0 min-h-0 border bg-overlay dark:bg-overlay-elevated rounded-lg" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-row items-center gap-1.5">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};
