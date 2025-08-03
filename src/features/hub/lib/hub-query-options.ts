import { type QueryClient, queryOptions } from "@tanstack/react-query";

import { getUrl } from "@/shared/lib/get-url";

import type { getHubById, getHubsByUserId } from "@/data-access/hubs/queries";

export const getHubsByUserIdQueryOptions = (queryClient: QueryClient) =>
  queryOptions({
    queryKey: ["hubs"],
    queryFn: async () => {
      const response = await fetch("/api/hubs", {
        method: "GET",
      });

      const result = (await response.json()) as Awaited<
        ReturnType<typeof getHubsByUserId>
      >;
      return result;
    },
    select: (hubs) => {
      // Set the hub data in the query client for each hub
      hubs.forEach((hub) => {
        const hubQueryOptions = getHubByIdQueryOptions(hub.id);
        const hubData = queryClient.getQueryData(hubQueryOptions.queryKey);
        if (!hubData) {
          queryClient.setQueryData(hubQueryOptions.queryKey, {
            color: hub.color,
            description: hub.description,
            id: hub.id,
            name: hub.name,
            status: hub.status,
            startDate: hub.startDate,
            endDate: hub.endDate,
          });
        }
      });

      return hubs;
    },
  });

export const getHubByIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub", hubId],
    queryFn: async () => {
      console.log("getHubByIdQueryOptions", hubId);
      const response = await fetch(getUrl(`/api/hubs/${hubId}`), {
        method: "GET",
      });

      const result = (await response.json()) as Awaited<
        ReturnType<typeof getHubById>
      >;

      return result;
    },
  });
