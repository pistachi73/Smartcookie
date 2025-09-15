import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { StudentProfileDetail } from "@/features/students/components/student-profile-detail";
import { getUserStudentByIdQueryOptions } from "@/features/students/lib/user-students-query-options";

interface StudentPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    ...getUserStudentByIdQueryOptions(Number.parseInt(studentId)),
  });

  const dehydratedState = dehydrate(queryClient);

  console.log("studentId", studentId, Number.parseInt(studentId));

  return (
    <HydrationBoundary state={dehydratedState}>
      <StudentProfileDetail id={Number.parseInt(studentId)} />
    </HydrationBoundary>
  );
}
