import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarBlock02Icon } from "@hugeicons-pro/core-solid-rounded";
import { format } from "date-fns";

import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";

type SessionConflictModalContentProps = {
  isConflictModalOpen: boolean;
  setIsConflictModalOpen: (open: boolean) => void;
  conflictsData?: {
    overlappingSessions: {
      s1: {
        startTime: string;
        endTime: string;
        hubName?: string;
      };
      s2: {
        startTime: string;
        endTime: string;
        hubName?: string;
      };
    }[];
  };
};

export const SessionConflictModalContent = ({
  isConflictModalOpen,
  setIsConflictModalOpen,
  conflictsData,
}: SessionConflictModalContentProps) => {
  return (
    <Modal.Content
      size="md"
      isOpen={isConflictModalOpen}
      onOpenChange={setIsConflictModalOpen}
      isBlurred
    >
      <Modal.Header
        title="Session Conflicts"
        description="The following sessions overlap with your scheduled time"
      />
      <Modal.Body className="pb-4 sm:pb-6">
        {conflictsData?.overlappingSessions?.map((conflictPair, index) => {
          const start1 = new Date(conflictPair.s1.startTime);
          const end1 = new Date(conflictPair.s1.endTime);
          const start2 = new Date(conflictPair.s2.startTime);
          const end2 = new Date(conflictPair.s2.endTime);

          return (
            <div key={index} className="p-1 border rounded-md mb-2">
              <div className="flex items-center gap-3">
                <div className="size-14 shrink-0 flex flex-col items-center justify-center rounded-md bg-bg dark:bg-overlay gap-0.5">
                  <p className="text-xs text-muted-fg leading-none">
                    {format(start1, "EEE")}
                  </p>
                  <p className="text-sm font-medium leading-none tabular-nums">
                    {format(start1, "dd/M")}
                  </p>
                </div>
                <div className="flex  gap-5 justify-between items-center w-full">
                  <div>
                    <p className="text-muted-fg text-xs line-clamp-1">
                      {conflictPair.s1.hubName
                        ? conflictPair.s1.hubName
                        : "New Session"}
                    </p>
                    <p className="font-medium text-sm tabular-nums">
                      {format(start1, "HH:mm")} - {format(end1, "HH:mm")}
                    </p>
                  </div>

                  <div className="size-7 sm:size-9 flex items-center justify-center rounded-md bg-danger/10">
                    <HugeiconsIcon
                      icon={CalendarBlock02Icon}
                      className="text-danger size-3 sm:size-4"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-muted-fg text-xs line-clamp-1 tabular-nums">
                      {conflictPair.s2.hubName
                        ? conflictPair.s2.hubName
                        : "New Session"}
                    </p>
                    <p className="font-medium text-sm">
                      {format(start2, "HH:mm")} - {format(end2, "HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Modal.Body>
    </Modal.Content>
  );
};

export const SessionConflictWarning = ({
  setIsConflictModalOpen,
}: {
  setIsConflictModalOpen: (open: boolean) => void;
}) => {
  return (
    <Note intent="warning">
      <div className="space-y-2">
        <p className="font-medium">Session time conflict detected.</p>
        <button
          className="cursor-pointer bg-amber-700 text-amber-50 rounded-md px-3 py-1.5 text-sm font-medium flex items-center gap-1"
          onClick={() => setIsConflictModalOpen(true)}
          type="button"
        >
          <HugeiconsIcon
            icon={CalendarBlock02Icon}
            className="size-3.5 text-background"
          />
          View conflicts
        </button>
      </div>
    </Note>
  );
};
