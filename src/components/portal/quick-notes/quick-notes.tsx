"use client";

import type { Hub, QuickNote } from "@/db/schema";
import { useEffect, useState } from "react";
import { AddNoteCard } from "./add-note-card";
import { NoteCard } from "./note-card";

interface QuickNotesProps {
  initialHubs: Hub[];
}

export const QuickNotes = ({ initialHubs }: QuickNotesProps) => {
  const [notes, setNotes] = useState<
    (QuickNote & { hub: { name: string; id: number } | null })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hubs, setHubs] = useState<Hub[]>(initialHubs);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quick-notes");
      if (!response.ok) throw new Error("Failed to fetch notes");

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (content: string, hubId?: number) => {
    try {
      const response = await fetch("/api/quick-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          hubId: hubId || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      await fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleUpdateNote = async (id: number, content: string) => {
    try {
      const response = await fetch("/api/quick-notes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          content,
        }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      await fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/quick-notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Group notes by hubId
  const notesByHub = notes.reduce(
    (acc, note) => {
      const hubId = note.hubId === 0 ? 0 : note.hubId;
      if (!acc[hubId]) {
        acc[hubId] = [];
      }
      acc[hubId].push(note);
      return acc;
    },
    {} as Record<number, typeof notes>,
  );

  // Create an array of all hubIds including 0 for general notes
  const allHubIds = [0, ...hubs.map((hub) => hub.id)];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {allHubIds.map((hubId) => {
        const hubNotes = notesByHub[hubId] || [];
        const hub = hubs.find((h) => h.id === hubId);
        const columnTitle =
          hubId === 0 ? "General Notes" : hub?.name || "Unknown Hub";

        return (
          <div key={hubId} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{columnTitle}</h2>
            <div className="grid gap-4">
              <AddNoteCard
                hubId={hubId === 0 ? undefined : hubId}
                hubName={hubId === 0 ? undefined : columnTitle}
                onAdd={handleAddNote}
              />
              {hubNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
