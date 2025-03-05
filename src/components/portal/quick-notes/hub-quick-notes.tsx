import type { HubSummary, NoteSummary } from "@/app/(portal)/quick-notes/types";
import { Heading } from "@/components/ui";
import { AddNoteCard } from "./add-note-card";
import { NoteCard } from "./note-card";

interface HubQuickNotesProps {
  hub: HubSummary;
  notes: NoteSummary[];
}

export const HubQuickNotes = ({ hub, notes }: HubQuickNotesProps) => {
  if (!hub) return null;

  return (
    <div className='flex flex-col gap-2 w-[300px] h-full shrink-0'>
      <Heading
        level={4}
        className='p-2 bg-overlay-highlight rounded-md text-sm uppercase text-muted-fg'
      >
        {hub.name}
      </Heading>
      <AddNoteCard hubId={hub.id} />
      <div className='flex flex-col gap-2'>
        {notes?.map((note) => (
          <NoteCard key={note.id} noteId={note.id} />
        ))}
      </div>
    </div>
  );
};
