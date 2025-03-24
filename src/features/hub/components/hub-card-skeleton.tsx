"use client";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function HubCardSkeleton() {
  return (
    <Card className="h-full w-full bg-transparent border-border">
      <Card.Header>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </Card.Header>

      <Card.Content className="flex flex-col gap-4">
        <div className="flex -space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-8 rounded-full border-2 border-overlay-highlight"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card.Content>
    </Card>
  );
}
