import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CalendarCheckOut02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const SkeletonNextSession = () => {
  return (
    <div className="space-y-6 shrink-0 border rounded-lg shadow-sm flex flex-col h-full bg-overlay overflow-hidden p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex gap-4 items-center">
          <Heading
            level={4}
            className="text-base font-semibold flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={CalendarCheckOut02Icon} size={18} />
            Upcoming Session
          </Heading>
          <Separator orientation="vertical" className="h-4" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Skeleton className="h-8 w-28" soft />
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>

          <section className="flex flex-col gap-3">
            {Array.from({ length: 1 }).map((_, index) => (
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

        <div className="shrink-0 flex flex-col gap-4">
          <div className="flex flex-col gap-2 h-full">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full p-3 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
