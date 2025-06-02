"use client";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { useRouter } from "next/navigation";

type UnsavedChangesModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDiscard: () => void;
  onKeep: () => void;
  onStay: () => void;
  targetPath?: string;
};

export const UnsavedChangesModal = ({
  isOpen,
  onOpenChange,
  onDiscard,
  onKeep,
  onStay,
  targetPath,
}: UnsavedChangesModalProps) => {
  const router = useRouter();

  return (
    <Modal.Content
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      role="alertdialog"
      aria-label="Unsaved changes"
      isBlurred
    >
      <Modal.Header>
        <Modal.Title>Unsaved Changes</Modal.Title>
        <Modal.Description>
          You have unsaved survey data. What would you like to do?
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-sm text-muted-fg">
            You can choose one of the following options:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div>
                <p className="text-sm font-medium">Keep Changes</p>
                <p className="text-xs text-muted-fg">
                  Your survey data will be saved for later.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div>
                <p className="text-sm font-medium">Discard Changes</p>
                <p className="text-xs text-muted-fg">
                  All your survey data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2">
        <Button intent="secondary" onPress={onStay}>
          Stay on Page
        </Button>
        <Button intent="danger" onPress={onDiscard}>
          Discard Changes
        </Button>
        <Button intent="primary" onPress={onKeep}>
          Keep Changes
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
