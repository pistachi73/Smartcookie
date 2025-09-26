import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Button, type ButtonProps } from "@/shared/components/ui/button";

export const HubActionsMenuTrigger = (props: ButtonProps) => {
  return (
    <Button intent="secondary" size="sq-sm" className={"shrink-0"} {...props}>
      <HugeiconsIcon icon={Settings01Icon} data-slot="icon" />
    </Button>
  );
};
