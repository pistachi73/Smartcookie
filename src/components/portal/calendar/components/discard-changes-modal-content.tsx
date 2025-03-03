import { Button, Modal } from "@/components/ui";

export const DiscardChangesModalContent = ({
  isOpen,
  onOpenChange,
  onDiscardChanges,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDiscardChanges: () => void;
}) => {
  return (
    <Modal.Content isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
      <Modal.Header>
        <Modal.Title level={1} className="sm:text-2xl">
          Discard unsaved changes?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer className="flex justify-end gap-2">
        <Button
          appearance="plain"
          size="small"
          slot="close"
          className="text-text-sub"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          onPress={onDiscardChanges}
          intent="danger"
          size="small"
          className="px-8"
        >
          Discard
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
