import { UserMultiple02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const SurveyNoResponses = () => {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div className="relative size-14 bg-primary/10 rounded-full flex items-center justify-center">
        <HugeiconsIcon
          icon={UserMultiple02Icon}
          size={24}
          className="text-primary"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">No responses found</h3>
        <p className="text-sm text-muted-fg">
          Waiting for students to complete this survey!
        </p>
      </div>
    </div>
  );
};
