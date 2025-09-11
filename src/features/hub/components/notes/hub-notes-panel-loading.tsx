import { HugeiconsIcon } from "@hugeicons/react";
import { NoteAddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

import { NoteCardListLoading } from "@/features/quick-notes/components/note-card-list-loading";
import { HubPanelHeader } from "../hub-panel-header";

export const HubNotesPanelLoading = () => {
  return (
    <div>
      <HubPanelHeader
        title="Quick Notes"
        actions={
          <Button className={"w-full sm:w-fit"} size="sm" intent="primary">
            <HugeiconsIcon icon={NoteAddIcon} size={16} />
            Add note
          </Button>
        }
      />
      <NoteCardListLoading />
    </div>
  );
};
