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

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  const { cacheManager } = useOptimizedCalendar();

  return useProtectedMutation({
    schema: UpdateSessionSchema,
    mutationFn: updateSession,
    onMutate: async (variables) => {
      // Invalidate hub-specific queries
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });

      const { originalStartTime, startTime, endTime, status } = variables.data;
      const timezone = getLocalTimeZone();

      // Parse dates
      const originalDate = Temporal.Instant.from(originalStartTime)
        .toZonedDateTimeISO(timezone)
        .toPlainDate();
      const newDate = Temporal.Instant.from(startTime)
        .toZonedDateTimeISO(timezone)
        .toPlainDate();

      // Get original session from cache to preserve other properties
      const originalSessions = cacheManager.getDaySessions(originalDate);
      const originalSession = originalSessions.find(
        (session) => session.id === variables.sessionId,
      );

      if (!originalSession) {
        throw new Error("Session not found in cache");
      }

      // Create updated session with new values
      const updatedSession: LayoutCalendarSession = {
        ...originalSession,
        startTime,
        endTime,
        status: status || originalSession.status,
        students: originalSession.students,
      };

      // 🚀 OPTIMISTIC UPDATE: Remove from original date
      cacheManager.optimisticUpdate(originalDate, "delete", originalSession);

      // 🚀 OPTIMISTIC UPDATE: Add to new date (could be same date)
      cacheManager.optimisticUpdate(newDate, "create", updatedSession);

      return {
        originalSession,
        originalDate,
        newDate,
        updatedSession,
      };
    },
    onSuccess: async () => {
      toast.success("Session updated successfully");
    },
    onError: (_, __, context) => {
      toast.error("Failed to update session");

      // 🚀 Rollback optimistic updates
      if (context) {
        const { originalSession, originalDate, newDate, updatedSession } =
          context;

        // Remove failed optimistic session from new date
        cacheManager.optimisticUpdate(newDate, "delete", updatedSession);

        // Restore original session to original date
        cacheManager.optimisticUpdate(originalDate, "create", originalSession);
      }

      console.error("Update session failed, rolled back");
    },
  });
};
