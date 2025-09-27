"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { getPaginatedUserStudentsQueryOptions } from "../lib/user-students-query-options";
import { validateStudentsSearchParams } from "../lib/validate-students-search-params";
import { StudentsCardLayout } from "./students-card-layout";
import { StudentsPageLayout } from "./students-page-layout";
import { StudentsTable } from "./students-table";
import { StudentsTablePagination } from "./students-table/students-table-pagination";
import { StudentsTableSkeleton } from "./students-table/students-table-skeleton";

export const STUDENTS_PAGE_SIZE = 5;

const DynamicAddStudentModal = dynamic(
  () =>
    import("@/features/hub/components/students/add-student-modal").then(
      (mod) => mod.AddStudentModal,
    ),
  {
    ssr: false,
  },
);

export const Students = () => {
  const searchParams = useSearchParams();
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const { page, q } = validateStudentsSearchParams(searchParams);

  const { data, isLoading, isPlaceholderData } = useQuery(
    getPaginatedUserStudentsQueryOptions({
      page,
      pageSize: STUDENTS_PAGE_SIZE,
      q,
    }),
  );

  const isLoadingStudents = isLoading || isPlaceholderData;

  return (
    <StudentsPageLayout
      onNewStudentPress={() => setIsAddStudentModalOpen(true)}
    >
      <StudentsCardLayout>
        <Card.Content>
          {isLoadingStudents ? (
            <StudentsTableSkeleton />
          ) : (
            <StudentsTable students={data?.students ?? []} />
          )}
        </Card.Content>
        <Card.Footer className="justify-between w-full hidden md:flex">
          {isLoadingStudents ? (
            <div className=" items-center text-sm text-muted-fg hidden md:flex gap-0.5">
              Showing Page <Skeleton className="size-4 rounded-xs" /> of{" "}
              <Skeleton className="size-4 rounded-xs" /> of{" "}
              <Skeleton className="size-4 rounded-xs" /> results
            </div>
          ) : (
            <p className="text-sm text-muted-fg hidden md:block">
              Showing Page <span className="font-medium text-fg">{page}</span>{" "}
              of <span className="font-medium text-fg">{data?.totalPages}</span>{" "}
              of <span className="font-medium text-fg">{data?.totalCount}</span>{" "}
              results
            </p>
          )}
          <StudentsTablePagination totalPages={data?.totalPages ?? 0} />
        </Card.Footer>
      </StudentsCardLayout>
    </StudentsPageLayout>
  );
};
