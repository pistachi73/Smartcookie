"use client";

import { getLocalTimeZone } from "@internationalized/date";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { updateSession } from "@/data-access/sessions/mutations";
import { UpdateSessionSchema } from "@/data-access/sessions/schemas";
import { useOptimizedCalendar } from "@/features/calendar/providers/optimized-calendar-provider";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  const { cacheManager } = useOptimizedCalendar();

  return useProtectedMutation({
    schema: UpdateSessionSchema,
    mutationFn: updateSession,
    onMutate: async (variables) => {
      const { originalStartTime, startTime, endTime, status } = variables.data;
      const timezone = getLocalTimeZone();

      // Parse dates
      const originalDate = Temporal.Instant.from(originalStartTime)
        .toZonedDateTimeISO(timezone)
        .toPlainDate();
      const newDate = Temporal.Instant.from(startTime)
        .toZonedDateTimeISO(timezone)
        .toPlainDate();

      console.log({ cacheManager });
      // Get original session from cache to preserve other properties
      const originalSessions = cacheManager.getDaySessions(originalDate);
      const originalSession = originalSessions.find(
        (session) => session.id === variables.sessionId,
      );

      if (originalSession) {
        const updatedSession: LayoutCalendarSession = {
          ...originalSession,
          startTime,
          endTime,
          status: status || originalSession.status,
          students: originalSession.students,
        };

        cacheManager.optimisticUpdate(originalDate, "delete", originalSession);
        cacheManager.optimisticUpdate(newDate, "create", updatedSession);

        return {
          originalSession,
          originalDate,
          newDate,
          updatedSession,
        };
      }

      return {
        originalDate,
        newDate,
        originalSession: null,
        updatedSession: null,
      };
    },
    onSuccess: async (_, variables) => {
      const paginatedSessionsQueryKey = getPaginatedSessionsByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;

      queryClient.invalidateQueries({
        queryKey: paginatedSessionsQueryKey,
      });
      toast.success("Session updated successfully");
    },
    onError: (_, __, context) => {
      console.error(_);
      toast.error("Failed to update session");

      const { originalSession, originalDate, newDate, updatedSession } =
        context ?? {};

      if (originalSession && originalDate && newDate && updatedSession) {
        // Remove failed optimistic session from new date
        cacheManager.optimisticUpdate(newDate, "delete", updatedSession);

        // Restore original session to original date
        cacheManager.optimisticUpdate(originalDate, "create", originalSession);
      }

      console.error("Update session failed, rolled back");
    },
  });
};
