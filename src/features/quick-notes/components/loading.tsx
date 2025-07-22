import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";

import { Separator } from "@/ui/separator";
import { Skeleton } from "@/ui/skeleton";
import { PageHeader } from "@/shared/components/layout/page-header";
import { cn } from "@/shared/lib/classes";

import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

export const QuickNotesLoading = () => {
  return (
    <div className="min-h-0 h-full flex flex-col w-full overflow-hidden">
      <PageHeader
        title="Quick Notes"
        subTitle="Quickly jot down notes"
        icon={NoteIcon}
        className={{
          container: "bg-bg",
        }}
      />
      <div className="min-h-0 h-full flex  w-full overflow-hidden">
        <div
          className={cn(
            "transition-all duration-150 bg-bg border-r h-full bg-bg shrink-0",
            "w-[300px]",
          )}
        >
          <div className="p-4 h-[72px] flex items-center">
            <Skeleton className="h-6 w-3/4" />
          </div>

          <Separator orientation="horizontal" />
          <div className="p-4">
            <Skeleton soft className="h-10 w-full" />
          </div>
          <div className="p-4 space-y-2 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={`hub-toggle-skeleton-${index}`}
                soft
                className="h-10 w-full"
              />
            ))}
          </div>
        </div>
        <div className="flex   overflow-scroll">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-hub-${index}`}
              className=" pb-0 shrink-0 space-y-8 w-[320px] p-3"
            >
              <Skeleton className="h-12 w-full" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonNoteCard key={`skeleton-card-${index}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
