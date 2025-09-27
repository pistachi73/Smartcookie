import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarCheckOut02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const SkeletonNextSession = () => {
  return (
    <Card className="shrink-0 flex flex-col h-full bg-overlay @container">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title className="flex gap-2 @2xl:gap-4  flex-col @2xl:items-center  @2xl:flex-row">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={CalendarCheckOut02Icon} size={18} />
            Upcoming Session
          </span>
          <Separator
            orientation="vertical"
            className="h-4 hidden @2xl:block "
          />
          <Skeleton className="h-5 w-24" />
        </Card.Title>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 @2xl:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>

          <section className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="shrink-0 flex flex-col gap-4 ">
          <div className="flex flex-col gap-2 h-full">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full p-3 rounded-lg" />
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
