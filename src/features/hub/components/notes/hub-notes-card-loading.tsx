import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

import { NoteCardListLoading } from "@/features/quick-notes/components/note-card-list-loading";

export const HubNotesCardLoading = () => {
  return (
    <Card className="w-full">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title>Quick Notes</Card.Title>
        <Card.Action>
          <Button intent="outline" size="sq-xs">
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
