import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import * as m from "motion/react-m";
import { useState } from "react";

import { Heading } from "@/ui/heading";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import {
  quickNotesByHubIdQueryOptions,
  quickNotesHubsQueryOptions,
} from "@/features/quick-notes/lib/quick-notes-query-options";
import { NewQuickNoteButton } from "./new-quick-note-button";
import { NoteCardList } from "./note-card-list";

interface HubNotesStackProps {
  hubId: number;
}

export const HubNotesStack = ({ hubId }: HubNotesStackProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { data: hubs } = useSuspenseQuery(quickNotesHubsQueryOptions);
  const { data: notes } = useQuery(quickNotesByHubIdQueryOptions(hubId));

  const hub = hubs?.find((h) => h.id === hubId);

  if (!hub) return null;

  const colorClasses = getCustomColorClasses(hub.color as CustomColor);

  return (
    <m.div layout id="hub-notes-stack" className="space-y-3">
      <m.div layout className=" flex items-center justify-between b">
        <div className="w-full flex items-center gap-4 justify-between @xl:justify-start">
          <Heading
            level={3}
            className={cn("flex items-center gap-3", colorClasses.text)}
          >
            <div
              className={cn(
                "flex items-center gap-2 size-4 rounded-full",
                colorClasses.bg,
              )}
            />
            <span className="truncate">{hub.name}</span>
            <span className={cn("text-xs text-muted-fg font-normal")}>
              {notes?.length || 0} notes
            </span>
          </Heading>

          <NewQuickNoteButton
            intent="outline"
            size="sq-xs"
            className={"text-xs"}
            onPress={() => setIsAddingNote(true)}
            isDisabled={isAddingNote}
            data-testid={`add-note-${hub.id}`}
          >
            <HugeiconsIcon icon={AddIcon} size={16} data-slot="icon" />
          </NewQuickNoteButton>
        </div>
      </m.div>

      <NoteCardList
        hubId={hub.id}
        hubColor={hub.color}
        isAddingNote={isAddingNote}
        setIsAddingNote={setIsAddingNote}
      />
    </m.div>
  );
};
