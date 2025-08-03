import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteSession } from "@/data-access/sessions/mutations";
import { DeleteSessionsSchema } from "@/data-access/sessions/schemas";
import { getCalendarCacheManager } from "@/features/calendar/lib/calendar-cache";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";

export const useDeleteSession = ({ hubId }: { hubId: number }) => {
  const queryClient = useQueryClient();
  const cacheManager = getCalendarCacheManager();

  return useProtectedMutation({
    schema: DeleteSessionsSchema,
    mutationFn: deleteSession,
    onMutate: async (variables) => {
      // Invalidate hub-specific queries
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", hubId],
      });

      // For each session ID to delete, find and remove optimistically
      const sessionsToDelete: {
        session: LayoutCalendarSession;
        date: Temporal.PlainDate;
      }[] = [];

      // We need to iterate through sessions to find them by ID
      // Since we don't know which dates they're on, we'll have to search
      for (const sessionId of variables.sessionIds) {
        // Search through cache to find the session
        let foundSession: LayoutCalendarSession | undefined;
        let foundDate: Temporal.PlainDate | undefined;

        // We'll search a reasonable date range (current month ± 2 months)
        const today = Temporal.Now.plainDateISO();
        const searchStart = today.subtract({ months: 2 });
        const searchEnd = today.add({ months: 2 });

        for (
          let date = searchStart;
          Temporal.PlainDate.compare(date, searchEnd) <= 0;
          date = date.add({ days: 1 })
        ) {
          const daySessions = cacheManager.getDaySessions(date);
          const session = daySessions.find((s) => s.id === sessionId);

          if (session) {
            foundSession = session;
            foundDate = date;
            break;
          }
        }

        if (foundSession && foundDate) {
          sessionsToDelete.push({
            session: foundSession,
            date: foundDate,
          });

          // 🚀 OPTIMISTIC UPDATE: Remove from cache immediately
          cacheManager.optimisticUpdate(foundDate, "delete", foundSession);
        }
      }

      return {
        sessionsToDelete,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", hubId],
      });
      toast.success("Sessions deleted successfully");
    },
    onError: (error, _, context) => {
      // 🚀 Rollback optimistic deletes
      if (context?.sessionsToDelete) {
        context.sessionsToDelete.forEach(({ session, date }) => {
          // Restore deleted sessions back to cache
          cacheManager.optimisticUpdate(date, "create", session);
        });
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete sessions");
      }

      console.error("Delete sessions failed, rolled back:", error);
    },
  });
};
