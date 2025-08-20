"use client";

import { format } from "date-fns";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";

import { useDeleteSession } from "../../hooks/session/use-delete-sessions";
import { useSessionsByHubId } from "../../hooks/session/use-sessions-by-hub-id";
import { useSessionStore } from "../../store/session-store";

export function DeleteSessionsModalContent({ hubId }: { hubId: number }) {
  const selectedSessions = useSessionStore((store) => store.selectedSessions);
  const isDeleteModalOpen = useSessionStore((store) => store.isDeleteModalOpen);
  const setIsDeleteModalOpen = useSessionStore(
    (store) => store.setIsDeleteModalOpen,
  );
  const { data: sessions } = useSessionsByHubId(hubId);

  const { mutateAsync: deleteSessions, isPending } = useDeleteSession({
    hubId,
  });

  const handleDeleteSessions = async () => {
    await deleteSessions({ sessionIds: selectedSessions });
    setIsDeleteModalOpen(false);
  };

  return (
    <Modal.Content
      isOpen={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      size="sm"
      role="alertdialog"
    >
      <Modal.Header
        title="Delete Sessions"
        description={`Are you sure you want to delete ${selectedSessions.length} session${selectedSessions.length > 1 ? "s" : ""}? This action cannot be undone.`}
      />
      <Modal.Body className="space-y-1 max-h-[300px] overflow-y-auto">
        {selectedSessions.map((sessionId) => {
          const session = sessions?.find((session) => session.id === sessionId);
          if (!session) return null;
          return (
            <div
              key={`${sessionId}-${session.startTime}`}
              className="flex items-center gap-3 text-sm p-2 border rounded-lg tabular-nums"
            >
              <span className="font-medium tabular-nums w-22">
                {format(new Date(session.startTime), "MMM d, yyyy")}
              </span>
              <Separator orientation="vertical" className="h-3" />
              {format(new Date(session.startTime), "h:mm a")} -{" "}
              {format(new Date(session.endTime), "h:mm a")}
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
