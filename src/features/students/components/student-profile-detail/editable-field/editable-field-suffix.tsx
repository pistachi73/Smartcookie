import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelIcon,
  FloppyDiskIcon,
  PencilEdit01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

export const EditableFieldSuffix = ({
  isEditing,
  onEdit,
  onCancel,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="flex items-center gap-0.5">
      {isEditing ? (
        <>
          <Button
            size="sq-xs"
            type="submit"
            intent="plain"
            className=" text-primary hover:bg-primary hover:text-primary-fg"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
          </Button>
          <Button
            size="sq-xs"
            intent="plain"
            type="button"
            onPress={onCancel}
            className="hover:bg-secondary"
          >
            <HugeiconsIcon icon={CancelIcon} size={16} />
          </Button>
        </>
      ) : (
        <Button
          size="sq-xs"
          type="button"
          intent="plain"
          onPress={onEdit}
          className="shrink-0 hover:bg-secondary group-hover:flex hidden"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
        </Button>
      )}
    </div>
  );
};
