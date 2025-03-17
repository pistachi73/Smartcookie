import { Separator, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export const QuickNotesLoading = () => {
  return (
    <div className="min-h-0 h-full flex bg-overlay w-full overflow-hidden">
      <div
        className={cn(
          "transition-all duration-150 border-r h-full bg-overlay shrink-0",
          "w-[300px]",
        )}
      >
        <div className={cn("flex items-center p-4 justify-between")}>
          <Skeleton className="h-6 w-3/4" />
        </div>

        <Separator orientation="horizontal" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4 pb-0 w-full">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      <div className="flex gap-5 p-3 overflow-scroll">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-hub-${index}`}
            className=" pb-0 shrink-0 space-y-8 w-[320px]"
          >
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={`skeleton-card-${index}`}
                  className="h-32 w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
