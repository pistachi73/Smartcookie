import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/react-aria/dialog";
import { Radio, RadioGroup } from "@/components/ui/react-aria/radio-group";
import { Heading } from "react-aria-components";

export const DeleteEventOccurrenceDialog = () => {
  return (
    <Dialog className="p-6 w-fit rounded-3xl">
      <Heading slot="title" className="text-2xl text-center px-3 mb-4">
        Delete recurrent event
      </Heading>

      <RadioGroup defaultValue={"this"}>
        <Radio value={"this"}>
          <p>This event</p>
        </Radio>
        <Radio value={"future"}>
          <p>This and the following events</p>
        </Radio>
        <Radio value={"all"}>
          <p>All events</p>
        </Radio>
      </RadioGroup>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          slot="close"
          className="text-text-sub"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          //   onPress={onDiscardChanges}
          variant="destructive"
          size="sm"
          className="px-8"
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};
