import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/classes";

export const SkeletonSurveyListItem = () => {
  return (
    <div
      className={cn(
        "border border-border-skeleton rounded-lg transition-opacity",
      )}
    >
      <div
        className={cn(
          "w-full group p-3 px-4 sm:p-3 h-auto flex  flex-1 gap-2 justify-start",
        )}
      >
        <Skeleton className="size-14 rounded-sm" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
