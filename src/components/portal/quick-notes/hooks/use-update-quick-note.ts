import { updateQuickNoteAction } from "@/app/(portal)/quick-notes/actions";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseUpdateQuickNoteProps {
  noteId: number;
  initialContent: string;
}

export const useUpdateQuickNote = ({
  noteId,
  initialContent,
}: UseUpdateQuickNoteProps) => {
  const [content, setContent] = useState(initialContent);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate, isPending: isSaving } = useMutation({
    mutationKey: ["updateQuickNote", noteId],
    mutationFn: updateQuickNoteAction,
    onMutate: () => {
      setIsUnsaved(true);
    },
    onError: () => {
      toast.error(
        "Failed to save note. Changes will be lost if you navigate away.",
      );
    },
    onSuccess: () => {
      setIsUnsaved(false);
    },
  });

  const debouncedSave = (newContent: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (newContent !== initialContent) {
        mutate({
          id: noteId,
          content: newContent,
        });
      }
    }, 800);
  };

  const handleContentChange = (newContent: string) => {
    setIsUnsaved(true);
    setContent(newContent);
    debouncedSave(newContent);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    content,
    isUnsaved,
    isSaving,
    handleContentChange,
  };
};
