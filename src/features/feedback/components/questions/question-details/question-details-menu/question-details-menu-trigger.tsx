import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

export const QuestionDetailsMenuTrigger = ({
  isLazyLoading = false,
}: {
  isLazyLoading?: boolean;
}) => {
  return (
    <Button
      intent="outline"
      size="sq-sm"
      className={"shrink-0"}
      {...(!isLazyLoading && {
        "data-testid": "question-details-menu-trigger",
      })}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} size={18} data-slot="icon" />
    </Button>
  );
};
