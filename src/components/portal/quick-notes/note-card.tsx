"use client";

import type { NoteSummary } from "@/app/(portal)/quick-notes/types";
import { Button, Card, Textarea, Tooltip } from "@/components/ui";
import { Delete01Icon, Edit01Icon } from "@hugeicons/react";
import { useState } from "react";

interface NoteCardProps {
  note: NoteSummary;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note?.content ?? "");
  const [isLoading, setIsLoading] = useState(false);

  if (!note) return null;

  return (
    <Card className='h-full flex flex-col'>
      <Card.Header className='pb-2'>
        {/* {note.hubId !== 0 && note.hub ? (
          <div className='flex justify-between items-center'>
            <Link
              href={`/hubs/${note.hubId}`}
              className='text-sm font-medium text-primary hover:underline'
            >
              {note.hub.name}
            </Link>
            <span className='text-xs text-muted-fg'>{formattedDate}</span>
          </div>
        ) : (
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium'>General Note</span>
            <span className='text-xs text-muted-fg'>{formattedDate}</span>
          </div>
        )} */}
      </Card.Header>
      <Card.Content className='flex-grow'>
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
          <p className='text-sm whitespace-pre-wrap break-words'>{note.content}</p>
        )}
      </Card.Content>
      <Card.Footer className='pt-2 flex justify-end gap-2'>
        {isEditing ? (
          <Button size='small' isDisabled={isLoading}>
            <Edit01Icon className='size-4 mr-1' />
            Save
          </Button>
        ) : (
          <Tooltip>
            <Button
              size='small'
              appearance='plain'
              isDisabled={isLoading}
              onPress={() => setIsEditing(true)}
            >
              <Edit01Icon className='size-4' />
            </Button>
            <Tooltip.Content>Edit note</Tooltip.Content>
          </Tooltip>
        )}
        <Tooltip>
          <Button size='small' appearance='plain' isDisabled={isLoading}>
            <Delete01Icon className='size-4' />
          </Button>
          <Tooltip.Content>Delete note</Tooltip.Content>
        </Tooltip>
      </Card.Footer>
    </Card>
  );
};
