import type { getSessionsByHubId } from "@/data-access/sessions/queries";
import { queryOptions } from "@tanstack/react-query";

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
