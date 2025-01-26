import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/react-aria/dialog";
import { Heading } from "react-aria-components";

export const DiscardChangesDialog = ({
  onDiscardChanges,
}: {
  onDiscardChanges: () => void;
}) => {
  return (
    <Dialog className="p-6 w-fit rounded-3xl">
      <Heading slot="title" className="text-2xl text-center px-3">
        Discard unsaved changes?
      </Heading>

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
          onPress={onDiscardChanges}
          variant="destructive"
          size="sm"
          className="px-8"
        >
          Discard
        </Button>
      </div>
    </Dialog>
  );
};
