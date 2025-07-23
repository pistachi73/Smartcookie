"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Skeleton component for AgendaSessionCard loading state
 */
export const AgendaSessionCardSkeleton = () => {
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
