import { Heading } from "@/shared/components/ui/heading";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/classes";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const CalendarSkeleton = () => {
  const now = new Date();
  return (
    <div className="min-h-0 h-full flex flex-col bg-bg">
      {/* Header */}

      <div className="p-5 border-b flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center">
        <div className="flex items-center gap-x-4">
          <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
            <HugeiconsIcon
              icon={FolderLibraryIcon}
              size={20}
              className="text-primary"
            />
          </div>
          <div className="flex flex-col">
            <Heading level={1}>Calendar</Heading>
            <span className="text-muted-fg text-sm">Manage your calendar</span>
          </div>
        </div>
      </div>

      {/* Calendar body */}
      <div className="h-full min-h-0 flex-1 flex bg-overlay">
        {/* Calendar view skeleton */}
        <div className="grow overflow-hidden flex flex-col">
          {/* Calendar header skeleton */}
          <div className="border-b px-4 py-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-60" />
              <div className="flex gap-2">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-9 w-16 rounded-lg" />
                <Skeleton className="h-9 w-12 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Calendar grid skeleton */}
          <div className="flex-1">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 border-b py-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={`day-header-${index}`}
                  className="h-4 w-2/3 mx-auto rounded-xs"
                />
              ))}
            </div>

            {/* Calendar grid - simplified */}
            <div className="grid grid-cols-7 h-[calc(100%-2rem)]">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={`cell-${index}`}
                  className={cn(
                    "border border-border-skeleton p-2",
                    index % 7 === 0 && "border-l-0",
                    index % 7 === 6 && "border-r-0",
                  )}
                >
                  <Skeleton className="h-4 w-4 mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="min-h-0 shrink-0 relative w-[293px] border-l">
          <div className="flex flex-col relative">
            <div className="border-b p-4 flex flex-col gap-3">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={`upcoming-session-${index}`}
                    className="h-14 w-full rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
