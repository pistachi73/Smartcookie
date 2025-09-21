import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";

import type { CustomColor } from "@/db/schema";
import { NewQuickNoteButton } from "@/features/quick-notes/components/new-quick-note-button";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";

export const HubNotesCard = ({
  hubId,
  hubColor,
}: {
  hubId: number;
  hubColor: CustomColor;
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Quick Notes</Card.Title>
        <Card.Description>View the course notes</Card.Description>
        <Card.Action>
          <NewQuickNoteButton
            intent="outline"
            size="sq-sm"
            onPress={() => setIsAddingNote(true)}
            isDisabled={isAddingNote}
          >
            <HugeiconsIcon icon={AddIcon} size={16} />
          </NewQuickNoteButton>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <NoteCardList
          hubId={Number(hubId)}
          hubColor={hubColor}
          isAddingNote={isAddingNote}
          setIsAddingNote={setIsAddingNote}
        />
      </Card.Content>
    </Card>
  );
};
