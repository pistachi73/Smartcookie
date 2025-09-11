import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

export const SurveyTemplateDetailsMenuTrigger = ({
  isLazyLoading = false,
}: {
  isLazyLoading?: boolean;
}) => {
  return (
    <Button
      intent="outline"
      size="sq-sm"
      {...(!isLazyLoading && {
        "data-testid": "survey-template-details-menu-trigger",
      })}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} size={18} data-slot="icon" />
    </Button>
  );
};
