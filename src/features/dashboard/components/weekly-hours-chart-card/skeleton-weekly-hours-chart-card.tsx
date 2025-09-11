"use client";

import { Card } from "@/shared/components/ui/card";
import { Loader } from "@/shared/components/ui/loader";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function SkeletonWeeklyHoursChartCard() {
  return (
    <Card className="@container">
      <Card.Header>
        <Card.Title>Weekly teaching hours</Card.Title>
        <Card.Description className="hidden @2xl:block">
          View your weekly teaching hours and how they are distributed across
          different hubs.
        </Card.Description>
        <Card.Action>
          <Skeleton className="h-9 w-40" soft />
        </Card.Action>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-12" />
        </div>

        <div className="aspect-video h-56 sm:h-80 flex items-center justify-center w-full">
          <Loader size="lg" variant="spin" intent="secondary" />
        </div>
      </Card.Content>
    </Card>
  );
}
