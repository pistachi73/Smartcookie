import type { getHubById, getHubsByUserId } from "@/data-access/hubs/queries";
import { getUrl } from "@/shared/lib/get-url";
import { queryOptions } from "@tanstack/react-query";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

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

export const getHubByIdQueryOptions = (
  hubId: number,
  headers?: ReadonlyHeaders,
) =>
  queryOptions({
    queryKey: ["hub", hubId],
    queryFn: async () => {
      const fetchHeaders: HeadersInit = {};

      if (headers) {
        const cookie = headers.get("cookie");
        if (cookie) {
          fetchHeaders.cookie = cookie;
        }
      }

      const response = await fetch(getUrl(`/api/hubs/${hubId}`), {
        method: "GET",
        headers: fetchHeaders,
      });

      const result = (await response.json()) as Awaited<
        ReturnType<typeof getHubById>
      >;

      return result;
    },
    enabled: !!hubId,
  });
