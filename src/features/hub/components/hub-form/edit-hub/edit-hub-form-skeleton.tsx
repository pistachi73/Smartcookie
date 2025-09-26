import { Skeleton } from "@/shared/components/ui/skeleton";

export const EditHubFormSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Name field with color picker */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-12" />

        <div className="flex gap-2 items-center">
          {/* Color picker skeleton */}
          <Skeleton className="size-10 rounded-lg" />
          {/* Name input skeleton */}
          <Skeleton className="flex-1 w-full h-10" />
        </div>
      </div>

      {/* Date pickers */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Start Date */}
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-1.5" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* End Date */}
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-1.5" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Description textarea */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-3 w-48" />
      </div>

      {/* Level and Schedule fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Level field */}
        <div className="flex-1">
          <Skeleton className="h-4 w-12 mb-1.5" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-32 mt-1" />
        </div>
        {/* Schedule field */}
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-1.5" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-40 mt-1" />
        </div>
      </div>
    </div>
  );
};
