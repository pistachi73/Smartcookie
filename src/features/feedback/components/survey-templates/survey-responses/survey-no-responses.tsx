import {
  Calendar03Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { HugeiconsIcon } from "@hugeicons/react";

export const SurveyNoResponses = () => {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div className="relative size-14 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
        <HugeiconsIcon
          icon={UserGroupIcon}
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
      <div className="w-fit flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-dashed border-muted-fg/30">
        <HugeiconsIcon
          icon={Calendar03Icon}
          size={16}
          className="text-muted-fg"
        />
        <span className="text-sm text-muted-fg">
          Responses will appear here once students start submitting
        </span>
      </div>
    </div>
  );
};
