import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const SessionSkeleton = () => {
  return (
    <div className="border border-border-skeleton rounded-lg flex-1 mb-2 sm:mb-4 shadow-xs bg-overlay">
      <div className="group rounded-lg w-full flex flex-row items-center justify-between p-2 sm:p-1 sm:pr-4">
        <div className="flex flex-row items-center gap-4">
          <div className="hidden sm:flex flex-col items-center justify-center size-12 bg-bg dark:bg-overlay-highlight rounded-sm">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-6 mt-1" />
          </div>

          <div className="flex sm:hidden">
            <Skeleton className="size-12 rounded-full" />
          </div>

          <Skeleton className="h-4 w-20" />
          <Separator orientation="vertical" className="h-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="size-9 rounded" />
          <Skeleton className="size-9 rounded" />
        </div>
      </div>
    </div>
  );
};
