"use client";

import { format } from "date-fns";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";

import { useDeleteSession } from "../../hooks/session/use-delete-sessions";

type DeleteSessionsModalContentProps = {
  hubId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessfullyDeletedSessions?: () => void;
  sessions: {
    id: number;
    startTime: string;
    endTime: string;
  }[];
};

export function DeleteSessionsModalContent({
  hubId,
  open,
  onOpenChange,
  onSuccessfullyDeletedSessions,
  sessions,
}: DeleteSessionsModalContentProps) {
  const { mutateAsync: deleteSessions, isPending } = useDeleteSession({
    hubId,
  });

  console.log({ sessions });

  const handleDeleteSessions = async () => {
    await deleteSessions({ sessions });
    onOpenChange(false);
    onSuccessfullyDeletedSessions?.();
  };

  return (
    <Modal.Content
      isOpen={open}
      onOpenChange={onOpenChange}
      size="sm"
      role="alertdialog"
    >
      <Modal.Header
        title="Delete Sessions"
        description={`Are you sure you want to delete ${sessions.length} session${sessions.length > 1 ? "s" : ""}? This action cannot be undone.`}
      />
      <Modal.Body className="space-y-1 max-h-[300px] overflow-y-auto">
        {sessions.map((session) => {
          if (!session) return null;
          return (
            <div
              key={`${session.id}-${session.startTime}`}
              className="flex items-center gap-3 text-sm p-2 border rounded-lg tabular-nums"
            >
              <span className="font-medium tabular-nums w-22">
                {format(new Date(session.startTime), "MMM d, yyyy")}
              </span>
              <Separator orientation="vertical" className="h-3" />
              {format(new Date(session.startTime), "HH:mm")} -{" "}
              {format(new Date(session.endTime), "HH:mm")}
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Modal.Close size="sm">Cancel</Modal.Close>
        <Button intent="danger" size="sm" onPress={handleDeleteSessions}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Deleting sessions..." />
          )}
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
}
