import { queryOptions } from "@tanstack/react-query";

import type { getStudentsByHubId } from "@/data-access/students/queries";

export type GetStudentsByHubIdQueryResponse = Awaited<
  ReturnType<typeof getStudentsByHubId>
>;

export const getStudentsByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-students", hubId],
    queryFn: async () => {
      const response = await fetch(`/api/hubs/${hubId}/students`);
      const result = (await response.json()) as GetStudentsByHubIdQueryResponse;
      return result;
    },
    enabled: !!hubId,
  });
