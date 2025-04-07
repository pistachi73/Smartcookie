"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Heading } from "@/ui/heading";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { HubCardSkeleton } from "./hub-card-skeleton";

export function SkeletonHubList() {
  return (
    <>
      <div className="@container h-full overflow-y-auto p-5 space-y-6 bg-bg">
        <div className="flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center">
          <div className="flex items-center gap-x-4">
            <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
              <HugeiconsIcon
                icon={FolderLibraryIcon}
                size={24}
                className="text-primary"
              />
            </div>
            <div className="flex flex-col">
              <Heading level={1}>Hubs</Heading>
              <span className="text-muted-fg text-sm">
                Manage your hubs and content
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-end w-full @2xl:w-auto">
            <Skeleton className="flex-1 @2xl:flex-none w-[300px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <HubCardSkeleton key={`hub-skeleton-${i}`} />
          ))}
        </div>
      </div>
    </>
  );
}
