"use client";

import { getLocalTimeZone } from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { addSessions } from "@/data-access/sessions/mutations";
import { AddSessionsSchema } from "@/data-access/sessions/schemas";
import { getCalendarCacheManager } from "@/features/calendar/lib/calendar-cache";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { getHubsByUserIdQueryOptions } from "../../lib/hub-query-options";
import { getPaginatedSessionsByHubIdQueryOptions } from "../../lib/hub-sessions-query-options";

export const useAddSessions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  const { data: hubs } = useQuery(getHubsByUserIdQueryOptions);
  const cacheManager = getCalendarCacheManager();

  return useProtectedMutation({
    schema: AddSessionsSchema,
    mutationFn: addSessions,
    onMutate: async (variables) => {
      const timezone = getLocalTimeZone();
      const optimisticSessions: LayoutCalendarSession[] = [];

      // Create optimistic sessions and add to cache
      variables.sessions.forEach((sessionData, index) => {
        const sessionDate = Temporal.Instant.from(sessionData.startTime)
          .toZonedDateTimeISO(timezone)
          .toPlainDate();

        // Find the hub data to get students
        const hubData = hubs?.find((hub) => hub.id === variables.hubId);

        // Create optimistic session
        const optimisticSession: LayoutCalendarSession = {
          id: -(Date.now() + index), // Unique negative ID to avoid conflicts
          startTime: sessionData.startTime,
          endTime: sessionData.endTime,
          status: "upcoming",
          hub: {
            id: variables.hubId,
            name: sessionData.hub?.name || hubData?.name || "Unknown Hub",
            color:
              (sessionData.hub?.color as any) || hubData?.color || "neutral",
          },
          students: hubData?.students || [],
          columnIndex: 0,
          totalColumns: 1,
        };

        optimisticSessions.push(optimisticSession);

        // 🚀 OPTIMISTIC UPDATE: Add to memory cache immediately
        cacheManager.optimisticUpdate(sessionDate, "create", optimisticSession);
      });

      return {
        optimisticSessions, // Track for cleanup
      };
    },
    onSuccess: (realSessions, variables, context) => {
      // 🚀 Replace optimistic sessions with real data

      if (
        context?.optimisticSessions &&
        realSessions &&
        Array.isArray(realSessions)
      ) {
        const timezone = getLocalTimeZone();

        // Remove optimistic sessions and add real ones
        context.optimisticSessions.forEach((optimisticSession, index) => {
          const sessionDate = Temporal.Instant.from(optimisticSession.startTime)
            .toZonedDateTimeISO(timezone)
            .toPlainDate();

          // Remove optimistic session
          cacheManager.optimisticUpdate(
            sessionDate,
            "delete",
            optimisticSession,
          );

          // Add real session (if available)
          if (realSessions[index]) {
            cacheManager.optimisticUpdate(sessionDate, "create", {
              ...optimisticSession,
              id: realSessions[index].id,
            });
          }
        });
      }

      const paginatedSessionsQueryKey = getPaginatedSessionsByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;

      queryClient.invalidateQueries({
        queryKey: paginatedSessionsQueryKey,
      });

      toast.success("Session added successfully");
      onSuccess?.();
    },
    onError: (error, _, context) => {
      toast.error("Failed to add sessions. Please try again later!");

      // 🚀 Rollback optimistic updates from memory cache
      if (context?.optimisticSessions) {
        const timezone = getLocalTimeZone();

        context.optimisticSessions.forEach((optimisticSession) => {
          const sessionDate = Temporal.Instant.from(optimisticSession.startTime)
            .toZonedDateTimeISO(timezone)
            .toPlainDate();

          // Remove failed optimistic session from memory cache
          cacheManager.optimisticUpdate(
            sessionDate,
            "delete",
            optimisticSession,
          );
        });
      }

      console.error("Create sessions failed, rolled back:", error);
    },
  });
};
