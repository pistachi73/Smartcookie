import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { Students } from "@/features/students/components";
import { getPaginatedUserStudentsQueryOptions } from "@/features/students/lib/user-students-query-options";

const StudentsPage = async () => {
  const queryclient = getQueryClient();

  void queryclient.prefetchQuery(getPaginatedUserStudentsQueryOptions());

  const dehydratedState = dehydrate(queryclient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Students />
    </HydrationBoundary>
  );
};

export default StudentsPage;
