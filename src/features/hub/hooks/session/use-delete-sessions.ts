import { getLocalTimeZone } from "@internationalized/date";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteSession } from "@/data-access/sessions/mutations";
import { DeleteSessionsSchema } from "@/data-access/sessions/schemas";
import { getCalendarCacheManager } from "@/features/calendar/lib/calendar-cache";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";

export const useDeleteSession = ({ hubId }: { hubId: number }) => {
  const queryClient = useQueryClient();
  const cacheManager = getCalendarCacheManager();

  return useProtectedMutation({
    schema: DeleteSessionsSchema,
    mutationFn: deleteSession,
    onMutate: async (variables) => {
      // For each session to delete, use the start time to find the exact date
      const sessionsToDelete: {
        session: LayoutCalendarSession;
        date: Temporal.PlainDate;
      }[] = [];

      for (const sessionToDelete of variables.sessions) {
        // Parse the start time to get the date directly
        const sessionDate = Temporal.Instant.from(sessionToDelete.startTime)
          .toZonedDateTimeISO(getLocalTimeZone())
          .toPlainDate();

        // Get sessions for this specific date
        const daySessions = cacheManager.getDaySessions(sessionDate);
        const foundSession = daySessions.find(
          (s) => s.id === sessionToDelete.id,
        );

        if (foundSession) {
          sessionsToDelete.push({
            session: foundSession,
            date: sessionDate,
          });

          cacheManager.optimisticUpdate(sessionDate, "delete", foundSession);
        }
      }

      return {
        sessionsToDelete,
      };
    },
    onSuccess: () => {
      const paginatedSessionsQueryKey =
        getPaginatedSessionsByHubIdQueryOptions(hubId).queryKey;

      queryClient.invalidateQueries({
        queryKey: paginatedSessionsQueryKey,
      });

      toast.success("Sessions deleted successfully");
    },
    onError: (_, __, context) => {
      if (context?.sessionsToDelete) {
        context.sessionsToDelete.forEach(({ session, date }) => {
          cacheManager.optimisticUpdate(date, "create", session);
        });
      }

      toast.error("Failed to delete sessions");
    },
  });
};
