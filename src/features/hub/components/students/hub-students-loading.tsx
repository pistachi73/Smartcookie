import { HugeiconsIcon } from "@hugeicons/react";
import { DeleteIcon, UserAdd02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

import { HubPanelHeader } from "../hub-panel-header";
import { SkeletonStudentListView } from "./skeleton-student-list-view";

export const HubStudentsLoading = () => {
  return (
    <div className="min-h-0">
      <HubPanelHeader
        title="Course Students"
        actions={
          <Button className={"w-full sm:w-fit"} size="sm" intent="primary">
            <HugeiconsIcon
              icon={UserAdd02Icon}
              altIcon={DeleteIcon}
              size={16}
              data-slot="icon"
            />
            <p>Add student</p>
          </Button>
        }
      />
      <SkeletonStudentListView />
    </div>
  );
};
