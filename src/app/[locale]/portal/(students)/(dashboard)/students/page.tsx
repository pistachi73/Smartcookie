import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getUserStudentCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/student-count-query-options";
import { generatePortalMetadata } from "@/shared/lib/generate-metadata";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { Students } from "@/features/students/components";
import { getPaginatedUserStudentsQueryOptions } from "@/features/students/lib/user-students-query-options";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Students" });
};

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
