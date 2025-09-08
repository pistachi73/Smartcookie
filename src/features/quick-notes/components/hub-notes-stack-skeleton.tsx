import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/classes";

import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

interface HubNotesStackSkeletonProps {
  className?: string;
  numberOfNotes?: number;
}

export const HubNotesStackSkeleton = ({
  className,
  numberOfNotes = 3,
}: HubNotesStackSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center gap-4 justify-between @xl:justify-start">
          {/* Hub title with color dot and count */}
          <div className="flex items-center gap-3">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
      </div>

      {/* Notes list skeleton */}
      <div className="columns-1 @lg:columns-2 @4xl:columns-3  gap-3 space-y-3">
        {Array.from({ length: numberOfNotes }).map((_, index) => (
          <SkeletonNoteCard key={index} />
        ))}
      </div>
    </div>
  );
};
