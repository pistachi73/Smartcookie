import { queryOptions } from "@tanstack/react-query";

import { getUrl } from "@/shared/lib/get-url";

import type { getHubById, getHubsByUserId } from "@/data-access/hubs/queries";

export const getHubsByUserIdQueryOptions = queryOptions({
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
});

export const getHubByIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub", hubId],
    queryFn: async () => {
      const response = await fetch(getUrl(`/api/hubs/${hubId}`), {
        method: "GET",
      });

      const result = (await response.json()) as Awaited<
        ReturnType<typeof getHubById>
      >;

      return result;
    },
    enabled: !!hubId,
  });
