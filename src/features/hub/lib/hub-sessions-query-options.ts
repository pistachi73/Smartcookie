import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  getHubOverviewSessions,
  getPaginatedSessionsByHubId,
  type getSessionsByHubId,
} from "@/data-access/sessions/queries";

export const getSessionsByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-sessions", hubId],
    queryFn: async () => {
      const response = await fetch(`/api/hubs/${hubId}/sessions`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
      }

      const json = (await response.json()) as Awaited<
        ReturnType<typeof getSessionsByHubId>
      >;

      return json;
    },
  });

export const getHubOverviewSessionsQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-overview-sessions", hubId],
    queryFn: async () => {
      return await getHubOverviewSessions({ hubId });
      // const response = await fetch(`/api/hubs/${hubId}/overview/sessions`, {
      //   method: "GET",
      // });
    },
  });

type PageParam = [string | undefined, "next" | "prev" | undefined];

export const getPaginatedSessionsByHubIdQueryOptions = (hubId: number) =>
  infiniteQueryOptions({
    queryKey: ["hub-infinite-sessions", hubId],
    queryFn: async ({ pageParam }) => {
      const [cursor, direction] = pageParam;
      return getPaginatedSessionsByHubId({
        hubId,
        cursor,
        limit: 10,
        direction,
      });
    },
    initialPageParam: [undefined, "next"] as PageParam,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage && lastPage.nextCursor
        ? ([lastPage.nextCursor, "next"] as PageParam)
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.prevCursor
        ? ([firstPage.prevCursor, "prev"] as PageParam)
        : undefined;
    },
  });
