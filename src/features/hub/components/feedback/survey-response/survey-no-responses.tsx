import { UserMultiple02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { EmptyState } from "@/shared/components/ui/empty-state";

export const SurveyNoResponses = () => {
  return (
    <EmptyState
      className="py-14 border-none"
      icon={UserMultiple02Icon}
      title="No responses found"
      description="Waiting for students to complete this survey!"
    />
  );
};
