import { Skeleton } from "@/shared/components/ui/skeleton";

export const SkeletonQuestionListItem = () => {
  return (
    <div className="relative flex flex-row gap-4 border-b p-5">
      <Skeleton className="size-5 rounded-sm" />
      <div className="space-y-2 w-full">
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-3 w-1/2 rounded-sm" />
        </div>

        <div className="flex flex-row gap-2">
          <Skeleton className="h-3 w-12 rounded-sm" />
          <Skeleton className="h-3 w-8 rounded-sm" />
        </div>
      </div>
    </div>
  );
};
