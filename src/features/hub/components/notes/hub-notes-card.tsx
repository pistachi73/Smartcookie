import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";

import type { CustomColor } from "@/db/schema";
import { AddNoteCard } from "@/features/quick-notes/components/add-note-card";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";

export const HubNotesCard = ({
  hubId,
  hubColor,
}: {
  hubId: number;
  hubColor: CustomColor;
}) => {
  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Quick Notes</Card.Title>
        <Card.Description>View the course notes</Card.Description>
        <Card.Action>
          <AddNoteCard hubId={hubId} intent="outline" size="sq-sm">
            <HugeiconsIcon icon={AddIcon} size={16} />
          </AddNoteCard>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <NoteCardList hubId={Number(hubId)} hubColor={hubColor} />
      </Card.Content>
    </Card>
  );
};
