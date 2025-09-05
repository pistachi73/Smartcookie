"use client";

import { AvatarStackSkeleton } from "@/shared/components/ui/avatar-stack/avatar-stack-skeleton";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const AgendaSessionCardSkeleton = () => {
  return (
    <div className="flex flex-row gap-2 p-1">
      <div className="flex flex-col gap-1 shrink-0 p-0.5 pr-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="w-1 shrink-0 min-w-0 min-h-0 rounded-lg" />
      <div className="space-y-1.5 p-0.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-row items-center gap-1.5">
          <AvatarStackSkeleton size="small" spacing="loose" maxAvatars={5} />
        </div>
      </div>
    </div>
  );
};
