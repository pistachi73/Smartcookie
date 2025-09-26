import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { StudentProfileDetail } from "@/features/students/components/student-profile-detail";
import { getUserStudentByIdQueryOptions } from "@/features/students/lib/user-students-query-options";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Students" });
};

export default async function StudentPage({
  params,
}: PageProps<"/[locale]/portal/students/[studentId]">) {
  const { studentId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    ...getUserStudentByIdQueryOptions(Number.parseInt(studentId)),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <StudentProfileDetail id={Number.parseInt(studentId)} />
    </HydrationBoundary>
  );
}
