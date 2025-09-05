import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { getPaginatedUserStudents } from "@/data-access/students/queries";
import { Students } from "@/features/students/components";
import { getPaginatedUserStudentsQueryOptions } from "@/features/students/lib/user-students-query-options";

const StudentsPage = async () => {
  const queryclient = getQueryClient();

  const params = {
    page: 1,
    pageSize: 10,
    q: "",
  };
  const studentsQueryOptions = getPaginatedUserStudentsQueryOptions(params);
  const students = await getPaginatedUserStudents(params);

  queryclient.setQueryData(studentsQueryOptions.queryKey, students);

  return (
    <HydrationBoundary state={dehydrate(queryclient)}>
      <Students />
    </HydrationBoundary>
  );
};

export default StudentsPage;
