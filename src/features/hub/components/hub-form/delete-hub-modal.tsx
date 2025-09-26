import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";
import { Note } from "@/ui/note";
import { ProgressCircle } from "@/ui/progress-circle";

import { useRouter } from "@/i18n/navigation";
import { useDeleteHub } from "../../hooks/use-delete-hub";
import type { Hub } from "../../types/hub.types";

interface DeleteHubModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hub: Pick<Hub, "id" | "name" | "description">;
}

export const DeleteHubModal = ({
  isOpen,
  onOpenChange,
  hub,
}: DeleteHubModalProps) => {
  const router = useRouter();
  const { mutate: deleteHub, isPending: isDeleting } = useDeleteHub({
    onSuccess: () => {
      onOpenChange(false);
      router.push("/portal/hubs");
    },
  });

  const handleDelete = () => {
    deleteHub({ hubId: hub.id });
  };

  return (
    <Modal.Content
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isDeleting}
      size="md"
    >
      <Modal.Header>
        <Modal.Title>Delete Course</Modal.Title>
        <Modal.Description>
          Are you sure you want to delete this course? This action cannot be
          undone.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3 bg-muted rounded-md border mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-balance">{hub.name}</p>
              {hub.description && (
                <p className="text-xs text-muted-fg line-clamp-2 mt-1">
                  {hub.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <Note intent="danger">
          <strong>Important:</strong> This course will be permanently deleted
          along with all associated sessions, notes, and student enrollments.
          This action cannot be undone.
        </Note>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close isDisabled={isDeleting}>Cancel</Modal.Close>
        <Button intent="danger" onPress={handleDelete} isPending={isDeleting}>
          {isDeleting && (
            <ProgressCircle isIndeterminate aria-label="Deleting course..." />
          )}
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
