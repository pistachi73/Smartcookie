import { Button } from "@/ui/button";
import { Modal, type ModalContentProps } from "@/ui/modal";
import { Radio, RadioGroup } from "@/ui/radio";

export const DeleteEventModalContent = (props: ModalContentProps) => {
  return (
    <Modal.Content size="sm" role="alertdialog" {...props}>
      <Modal.Header>
        <Modal.Title className="sm:text-2xl">
          Delete recurrent event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RadioGroup defaultValue={"this"} className={{ content: "gap-4" }}>
          <Radio value={"this"} className="text-base">
            This event
          </Radio>
          <Radio value={"future"} className="text-base">
            This and the following events
          </Radio>
          <Radio value={"all"} className="text-base">
            All events
          </Radio>
        </RadioGroup>
      </Modal.Body>
      <Modal.Footer className="mt-6 flex justify-end gap-2">
        <Button
          intent="plain"
          size="sm"
          slot="close"
          className="text-muted-fg hover:text-current"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          // onPress={onDiscardChanges}
          intent="danger"
          size="sm"
          className="px-8"
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
