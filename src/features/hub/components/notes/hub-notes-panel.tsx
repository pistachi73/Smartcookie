import { HugeiconsIcon } from "@hugeicons/react";
import { NoteAddIcon } from "@hugeicons-pro/core-stroke-rounded";

import type { CustomColor } from "@/db/schema";
import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { HubPanelHeader } from "../hub-panel-header";

export const HubNotesPanel = ({
  hubId,
  hubColor,
}: {
  hubId: number;
  hubColor: CustomColor;
}) => {
  return (
    <div>
      <HubPanelHeader
        title="Quick Notes"
        actions={
          <AddNoteCard
            hubId={hubId}
            className={"w-full sm:w-fit"}
            size="sm"
            intent="primary"
          >
            <HugeiconsIcon icon={NoteAddIcon} size={16} />
            Add note
          </AddNoteCard>
        }
      />
      <NoteCardList hubId={Number(hubId)} hubColor={hubColor} />
    </div>
  );
};
