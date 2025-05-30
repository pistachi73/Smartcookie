import { linkStyles } from "@/shared/components/ui/link";
import { Modal } from "@/shared/components/ui/modal";
import { Note } from "@/shared/components/ui/note";
import { CalendarBlock02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";

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
                <div className="size-12 flex flex-col items-center justify-center rounded-md bg-bg dark:bg-overlay">
                  <p className="text-xs text-muted-fg">
                    {format(start1, "MMM")}
                  </p>
                  <p className="text-sm font-medium">{format(start1, "dd")}</p>
                </div>
                <div className="flex-1">
                  <p className="text-muted-fg text-xs line-clamp-1">
                    {conflictPair.s1.hubName
                      ? conflictPair.s1.hubName
                      : "New Session"}
                  </p>
                  <p className="font-medium text-sm">
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
                  <p className="text-muted-fg text-xs line-clamp-1">
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
    <Note intent="danger">
      <p className="font-medium">
        Session time conflict detected.{" "}
        <button
          className={linkStyles({
            intent: "unstyled",
            className: "hover:underline cursor-pointer",
          })}
          onClick={() => setIsConflictModalOpen(true)}
          type="button"
        >
          View conflicts
        </button>
      </p>
    </Note>
  );
};
