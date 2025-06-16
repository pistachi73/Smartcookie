import type { getStudentsByUserId } from "@/data-access/students/queries";
import { queryOptions } from "@tanstack/react-query";

export type GetStudentsByUserIdQueryResponse = Awaited<
  ReturnType<typeof getStudentsByUserId>
>;

export const getStudentsByUserIdQueryOptions = () =>
  queryOptions({
    queryKey: ["user-students"],
    queryFn: async (): Promise<GetStudentsByUserIdQueryResponse> => {
      const response = await fetch("/api/user/students");

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result =
        (await response.json()) as GetStudentsByUserIdQueryResponse;
      return result;
    },
  });
