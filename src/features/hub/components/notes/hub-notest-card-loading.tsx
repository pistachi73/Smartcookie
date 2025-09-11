import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

import { NoteCardListLoading } from "@/features/quick-notes/components/note-card-list-loading";

export const HubNotesCardLoading = () => {
  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Quick Notes</Card.Title>
        <Card.Description>View the course notes</Card.Description>
        <Card.Action>
          <Button intent="outline" size="sq-sm">
            <HugeiconsIcon icon={AddIcon} size={16} />
          </Button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <NoteCardListLoading />
      </Card.Content>
    </Card>
  );
};
