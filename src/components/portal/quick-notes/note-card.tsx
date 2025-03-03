"use client";

import { Button, Card, Textarea, Tooltip } from "@/components/ui";
import type { QuickNote } from "@/db/schema";
import { Delete01Icon, Edit01Icon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

interface NoteCardProps {
  note: QuickNote & { hub: { name: string; id: number } | null };
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, content: string) => Promise<void>;
}

export const NoteCard = ({ note, onDelete, onUpdate }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setIsLoading(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        console.error("Failed to delete note:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (content.trim() === "") return;

    setIsLoading(true);
    try {
      await onUpdate(note.id, content);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="h-full flex flex-col">
      <Card.Header className="pb-2">
        {note.hubId !== 0 && note.hub ? (
          <div className="flex justify-between items-center">
            <Link
              href={`/hubs/${note.hubId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {note.hub.name}
            </Link>
            <span className="text-xs text-muted-fg">{formattedDate}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">General Note</span>
            <span className="text-xs text-muted-fg">{formattedDate}</span>
          </div>
        )}
      </Card.Header>
      <Card.Content className="flex-grow">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(value) => setContent(value)}
            className={{
              textarea: "w-full h-full min-h-[100px] resize-none",
            }}
            autoFocus
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">
            {note.content}
          </p>
        )}
      </Card.Content>
      <Card.Footer className="pt-2 flex justify-end gap-2">
        {isEditing ? (
          <Button size="small" isDisabled={isLoading} onPress={handleUpdate}>
            <Edit01Icon className="size-4 mr-1" />
            Save
          </Button>
        ) : (
          <Tooltip>
            <Button
              size="small"
              appearance="plain"
              isDisabled={isLoading}
              onPress={() => setIsEditing(true)}
            >
              <Edit01Icon className="size-4" />
            </Button>
            <Tooltip.Content>Edit note</Tooltip.Content>
          </Tooltip>
        )}
        <Tooltip>
          <Button
            size="small"
            appearance="plain"
            isDisabled={isLoading}
            onPress={handleDelete}
          >
            <Delete01Icon className="size-4" />
          </Button>
          <Tooltip.Content>Delete note</Tooltip.Content>
        </Tooltip>
      </Card.Footer>
    </Card>
  );
};
