import { HugeiconsIcon } from "@hugeicons/react";
import { NoteAddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";

import type { CustomColor } from "@/db/schema";
import { NewQuickNoteButton } from "@/features/quick-notes/components/new-quick-note-button";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { HubPanelHeader } from "../hub-panel-header";

export const HubNotesPanel = ({
  hubId,
  hubColor,
}: {
  hubId: number;
  hubColor: CustomColor;
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  return (
    <div>
      <HubPanelHeader
        title="Quick Notes"
        actions={
          <NewQuickNoteButton
            className={"w-full sm:w-fit"}
            size="sm"
            intent="primary"
            onPress={() => setIsAddingNote(true)}
            isDisabled={isAddingNote}
          >
            <HugeiconsIcon icon={NoteAddIcon} size={16} />
            Add note
          </NewQuickNoteButton>
        }
      />
      <NoteCardList
        hubId={Number(hubId)}
        hubColor={hubColor}
        isAddingNote={isAddingNote}
        setIsAddingNote={setIsAddingNote}
      />
    </div>
  );
};
