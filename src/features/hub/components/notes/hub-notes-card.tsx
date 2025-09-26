import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";

import type { CustomColor } from "@/db/schema";
import { NewQuickNoteButton } from "@/features/quick-notes/components/new-quick-note-button";
import { NoteCardList } from "@/features/quick-notes/components/note-card-list";
import { getHubByIdQueryOptions } from "../../lib/hub-query-options";

export const HubNotesCard = ({
  hubId,
  hubColor,
}: {
  hubId: number;
  hubColor: CustomColor;
}) => {
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  const [isAddingNote, setIsAddingNote] = useState(false);
  const isViewOnlyMode = hub?.status === "inactive";
  return (
    <Card className="w-full">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title>Quick Notes</Card.Title>
        <Card.Action>
          <NewQuickNoteButton
            intent="outline"
            size="sq-sm"
            onPress={() => setIsAddingNote(true)}
            isDisabled={isAddingNote || isViewOnlyMode}
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
          isViewOnlyMode={isViewOnlyMode}
        />
      </Card.Content>
    </Card>
  );
};
