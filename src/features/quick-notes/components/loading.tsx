import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PageHeader } from "@/shared/components/layout/page-header";
import { cn } from "@/shared/lib/classes";

import { HubNotesStackSkeleton } from "./hub-notes-stack-skeleton";

export const QuickNotesLoading = () => {
  return (
    <div className="min-h-0 h-full flex flex-col">
      <PageHeader
        title="Quick Notes"
        icon={NoteIcon}
        className={{
          actionsContainer: "flex-row items-center",
          container: "bg-bg flex-row items-center",
        }}
      />
      <div className="flex flex-1 h-full min-h-0 ">
        <div
          className={cn(
            "hidden lg:flex border-r h-full min-h-0 flex-col shrink-0  bg-muted w-[300px]",
          )}
        >
          <div className="p-4 pb-0 mb-2 space-y-2">
            <Heading level={3} className="mb-2">
              Filter by hubs
            </Heading>
          </div>

          <div className="p-4 overflow-y-auto">
            <div className="space-y-2 overflow-y-auto">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" soft={false} />
              ))}
            </div>
          </div>
        </div>
        <div className=" h-full grow relative shrink-0 bg-white p-4 sm:p-6 space-y-6 overflow-y-auto @container">
          <HubNotesStackSkeleton numberOfNotes={5} />
          <HubNotesStackSkeleton numberOfNotes={1} />
          <HubNotesStackSkeleton numberOfNotes={3} />
          <HubNotesStackSkeleton numberOfNotes={2} />
        </div>
      </div>
    </div>
  );
};
