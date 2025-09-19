import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getUserStudentCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/student-count-query-options";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { Students } from "@/features/students/components";
import { getPaginatedUserStudentsQueryOptions } from "@/features/students/lib/user-students-query-options";

const StudentsPage = async () => {
  const queryclient = getQueryClient();

  const students = await queryclient.fetchQuery(
    getPaginatedUserStudentsQueryOptions(),
  );

  queryclient.setQueryData(
    getUserStudentCountQueryOptions.queryKey,
    students.totalCount,
  );

  const dehydratedState = dehydrate(queryclient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Students />
    </HydrationBoundary>
  );
};

export default StudentsPage;
