"use client";

import { Button, Card, Textarea } from "@/components/ui";
import { Add01Icon } from "@hugeicons/react";
import { useState } from "react";

interface AddNoteCardProps {
  hubId?: number;
  hubName?: string;
  onAdd: (content: string, hubId?: number) => Promise<void>;
}

export const AddNoteCard = ({ hubId, hubName, onAdd }: AddNoteCardProps) => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (content.trim() === "") return;

    setIsLoading(true);
    try {
      await onAdd(content, hubId);
      setContent("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <Card.Header className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {hubName ? `Add note to ${hubName}` : "Add general note"}
          </span>
        </div>
      </Card.Header>
      <Card.Content className="flex-grow">
        {isExpanded ? (
          <Textarea
            value={content}
            onChange={(value) => setContent(value)}
            className={{
              textarea: "w-full min-h-[100px] resize-none",
            }}
            placeholder="Write your note here..."
            autoFocus
          />
        ) : (
          <div
            className="flex items-center justify-center h-full cursor-pointer border border-dashed border-muted-fg/30 rounded-md p-4 hover:border-primary/50 transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex flex-col items-center gap-2 text-muted-fg">
              <Add01Icon className="size-6" />
              <span className="text-sm">Click to add a note</span>
            </div>
          </div>
        )}
      </Card.Content>
      {isExpanded && (
        <Card.Footer className="pt-2 flex justify-end gap-2">
          <Button
            size="small"
            appearance="plain"
            onPress={() => {
              setIsExpanded(false);
              setContent("");
            }}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onPress={handleAdd}
            isDisabled={content.trim() === "" || isLoading}
          >
            Add Note
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};
