import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import {
  getPaginatedUserStudents,
  getStudentById,
} from "@/data-access/students/queries";
import type { GetPaginatedUserStudentsSchema } from "@/data-access/students/schemas";

export const getPaginatedUserStudentsQueryOptions = (
  params: z.infer<typeof GetPaginatedUserStudentsSchema>,
) => {
  return queryOptions({
    queryKey: ["user-students", params],
    queryFn: () => getPaginatedUserStudents(params),
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      return {
        students: [],
        page: params.page,
        pageSize: params.pageSize,
        totalPages: previousData?.totalPages,
        totalCount: previousData?.totalCount,
      };
    },
  });
};

export const getUserStudentByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["student", id],
    queryFn: async () => await getStudentById({ id }),
    enabled: !!id,
  });
};
