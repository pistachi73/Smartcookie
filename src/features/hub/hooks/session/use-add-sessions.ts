"use client";

import { getLocalTimeZone } from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { getSessionsCountByHubIdQueryOptions } from "@/shared/hooks/plan-limits/query-options/sessions-count-query-options";
import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
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
  const limitToaster = useLimitToaster();

  return useProtectedMutation({
    schema: AddSessionsSchema,
    mutationFn: addSessions,
    onMutate: async (variables) => {
      const timezone = getLocalTimeZone();
      const optimisticSessions: LayoutCalendarSession[] = [];

      const sessionCountQueryKey = getSessionsCountByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;

      const previousSessionCount =
        queryClient.getQueryData(sessionCountQueryKey);

      if (previousSessionCount) {
        queryClient.setQueryData(
          sessionCountQueryKey,
          previousSessionCount + variables.sessions.length,
        );
      }

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
        optimisticSessions,
        sessionCountQueryKey,
        previousSessionCount,
      };
    },
    onSuccess: (res, variables, context) => {
      if (isDataAccessError(res)) {
        if (context.previousSessionCount) {
          queryClient.setQueryData(
            context.sessionCountQueryKey,
            context.previousSessionCount,
          );
        }

        const timezone = getLocalTimeZone();

        context.optimisticSessions.forEach((optimisticSession) => {
          const sessionDate = Temporal.Instant.from(optimisticSession.startTime)
            .toZonedDateTimeISO(timezone)
            .toPlainDate();

          cacheManager.optimisticUpdate(
            sessionDate,
            "delete",
            optimisticSession,
          );
        });

        switch (res.type) {
          case "LIMIT_REACHED_SESSIONS": {
            limitToaster({
              title: res.message,
            });

            break;
          }
          default:
            toast.error(res.message);
            break;
        }
        return;
      }

      const timezone = getLocalTimeZone();

      context.optimisticSessions.forEach((optimisticSession, index) => {
        const sessionDate = Temporal.Instant.from(optimisticSession.startTime)
          .toZonedDateTimeISO(timezone)
          .toPlainDate();

        cacheManager.optimisticUpdate(sessionDate, "delete", optimisticSession);

        if (res[index]) {
          cacheManager.optimisticUpdate(sessionDate, "create", {
            ...optimisticSession,
            id: res[index].id,
          });
        }
      });

      toast.success("Session added successfully");

      const paginatedSessionsQueryKey = getPaginatedSessionsByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;

      queryClient.setQueryData(paginatedSessionsQueryKey, (oldData) => {
        if (!oldData) return undefined;
        const initialPage = oldData.pages.filter((page) => page.page === 0);
        const initialPageParams = oldData.pageParams.filter(
          (pageParam: any) => pageParam[2] === 0,
        );

        return {
          ...oldData,
          pages: initialPage,
          pageParams: initialPageParams,
        };
      });

      onSuccess?.();
    },
  });
};
