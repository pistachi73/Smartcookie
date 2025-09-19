import { queryOptions } from "@tanstack/react-query";

import { getUserStudentCount } from "@/data-access/students/queries";

export const getUserStudentCountQueryOptions = queryOptions({
  queryKey: ["user-student-count"],
  queryFn: getUserStudentCount,
});
