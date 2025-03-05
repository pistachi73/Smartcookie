import { createQuickNote } from "@/actions/quick-notes";
import { Button } from "@/components/ui/button";
import { useQuickNotesStore } from "@/hooks/use-quick-notes-store";
import { useState } from "react";
import { toast } from "sonner";

export function AddNoteForm({ hubId }: { hubId?: number }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNote, replaceNoteId } = useQuickNotesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create a temporary note with a negative ID for optimistic UI
      const tempNote = {
        id: -Date.now(), // Temporary negative ID
        content,
        hubId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "current-user-id", // This would come from your auth context
      };

      // 2. Add to store immediately for optimistic UI update
      const tempId = addNote(tempNote);

      // 3. Send to the server
      const result = await createQuickNote({
        content,
        hubId,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // 4. Replace the temporary note with the real one from the server
      if (result.data) {
        replaceNoteId(tempId, result.data);
      }

      // 5. Clear the form
      setContent("");
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Add a quick note...'
        className='min-h-[100px] w-full p-2 border rounded'
        disabled={isSubmitting}
      />
      <Button type='submit' className='w-full'>
        {isSubmitting ? "Adding..." : "Add Note"}
      </Button>
    </form>
  );
}
