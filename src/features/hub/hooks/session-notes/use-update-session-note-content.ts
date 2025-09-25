import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { extractUrls } from "@/shared/lib/url-utils";

import { updateSessionNote } from "@/data-access/session-notes/mutations";
import type { SessionNotePosition } from "@/db/schema";
import { getSessionNotesBySessionIdQueryOptions } from "../../lib/session-notes-query-options";

export interface UseUpdateSessionNoteContentProps {
  hubId: number;
  sessionId: number;
  noteId: number;
  initialContent: string;
  clientId?: string; // Add clientId to props for better matching
}

interface PendingSave {
  content: string;
  originalNoteId: number;
  position: SessionNotePosition;
  clientId?: string;
  retryStartTime: number;
}

export const useUpdateSessionNoteContent = ({
  hubId,
  sessionId,
  noteId,
  initialContent,
  clientId,
}: UseUpdateSessionNoteContentProps) => {
  const [urls, setUrls] = useState<string[]>(extractUrls(initialContent));
  const [content, setContent] = useState(initialContent);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<PendingSave | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending: isSaving } = useProtectedMutation({
    schema: z.object({
      hubId: z.number(),
      noteId: z.number(),
      sessionId: z.number(),
      content: z.string(),
      position: z.enum(["plans", "in-class"]),
    }),
    mutationFn: (data) =>
      updateSessionNote({
        hubId: data.hubId,
        noteId: data.noteId,
        sessionId: data.sessionId,
        content: data.content,
      }),
    onMutate: async (variables) => {
      setIsUnsaved(true);
      const sessionNotesQueryKey = getSessionNotesBySessionIdQueryOptions(
        variables.sessionId,
      ).queryKey;

      // Cancel any outgoing refetches for this hub
      await queryClient.cancelQueries({ queryKey: sessionNotesQueryKey });
      const previousData = queryClient.getQueryData(sessionNotesQueryKey);

      console.log({ previousData });

      queryClient.setQueryData(sessionNotesQueryKey, (old) => {
        if (!old) return old;

        const updatedNotes = { ...old };
        updatedNotes[variables.position] = updatedNotes[variables.position].map(
          (sessionNote) => {
            if (sessionNote.id === variables.noteId) {
              return {
                ...sessionNote,
                content: variables.content,
              };
            }
            return sessionNote;
          },
        );

        return updatedNotes;
      });

      return { previousData, sessionNotesQueryKey };
    },
    onError: (_err, _variables, context) => {
      // Revert the optimistic update
      if (context) {
        queryClient.setQueryData(
          context.sessionNotesQueryKey,
          context.previousData,
        );
      }

      toast.error(
        "Failed to save note. Changes will be lost if you navigate away.",
      );
    },
    onSuccess: () => {
      setIsUnsaved(false);
      pendingSaveRef.current = null;

      // Clear any retry intervals since save was successful
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    },
  });

  const debouncedSave = (content: string, position: "plans" | "in-class") => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setUrls(extractUrls(content));

      if (noteId < 0) {
        // Store pending save for retry when noteId becomes positive
        pendingSaveRef.current = {
          content,
          originalNoteId: noteId,
          position,
          clientId,
          retryStartTime: Date.now(),
        };
        startRetryInterval();
        return;
      }

      if (content !== initialContent) {
        mutate({
          hubId,
          noteId: noteId,
          sessionId: sessionId,
          position,
          content,
        });
      }
    }, 800);
  };

  const startRetryInterval = () => {
    // Clear existing retry interval
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
    }

    // Start new retry interval
    retryIntervalRef.current = setInterval(() => {
      if (!pendingSaveRef.current) {
        // No pending save, clear interval
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }
        return;
      }

      const pendingSave = pendingSaveRef.current;
      const retryDuration = Date.now() - pendingSave.retryStartTime;

      // Give up after 5 seconds - note creation likely failed
      if (retryDuration > 5000) {
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }
        pendingSaveRef.current = null;
        setIsUnsaved(false);
        return;
      }

      if (noteId >= 0) {
        // Clear the retry interval since we can now save
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }

        // Attempt to save the pending content
        mutate({
          hubId,
          noteId: noteId,
          sessionId: sessionId,
          position: pendingSave.position,
          content: pendingSave.content,
        });
      }
    }, 1000); // Retry every second
  };

  const handleContentChange = (
    content: string,
    position: "plans" | "in-class",
  ) => {
    setIsUnsaved(true);
    setContent(content);
    debouncedSave(content, position);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, []);

  return {
    content,
    isUnsaved,
    isSaving,
    urls,
    handleContentChange,
  };
};
