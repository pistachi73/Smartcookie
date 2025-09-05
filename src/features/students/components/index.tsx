"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/layout/page-header";

import { getPaginatedUserStudentsQueryOptions } from "../lib/user-students-query-options";
import { validateStudentsSearchParams } from "../lib/validate-students-search-params";
import { StudentsTable, StudentsTableSkeleton } from "./students-table";
import { StudentsTablePagination } from "./students-table/students-table-pagination";
import { StudentsTableSearch } from "./students-table/students-table-search";

export const StudentsPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="space-y-6 p-4 sm:p-6 overflow-y-auto">
    <PageHeader
      title="Students"
      subTitle="Manage your students"
      icon={UserGroupIcon}
      className={{
        container: "border-none p-0!",
      }}
      actions={
        <Button>
          <HugeiconsIcon icon={PlusSignIcon} data-slot="icon" />
          Add student
        </Button>
      }
    />
    {children}
  </div>
);

export const StudentsCardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <div className="px-(--card-spacing) flex flex-col gap-4 md:gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <CardTitle>Explore students</CardTitle>
          <CardDescription className="text-balance">
            Manage your students and their progress. Add, edit, and delete
            students as needed.
          </CardDescription>
        </div>
        <div className="flex-1 w-full md:w-auto flex items-end h-full">
          <StudentsTableSearch />
        </div>
      </div>
      {children}
    </Card>
  );
};

export const Students = () => {
  const searchParams = useSearchParams();
  const { page, q } = validateStudentsSearchParams(searchParams);

  const { data, isLoading, isPlaceholderData } = useQuery(
    getPaginatedUserStudentsQueryOptions({
      page,
      pageSize: 10,
      q,
    }),
  );

  const isLoadingStudents = isLoading || isPlaceholderData;

  return (
    <StudentsPageLayout>
      <StudentsCardLayout>
        <Card.Content>
          {isLoadingStudents ? (
            <StudentsTableSkeleton />
          ) : (
            <StudentsTable students={data?.students ?? []} />
          )}
        </Card.Content>
        <Card.Footer className="justify-between w-full hidden md:flex">
          <p className="text-sm text-muted-fg hidden md:block">
            Showing Page <span className="font-medium text-fg">{page}</span> of{" "}
            <span className="font-medium text-fg">{data?.totalPages}</span> of{" "}
            <span className="font-medium text-fg">{data?.totalCount}</span>{" "}
            results
          </p>
          <StudentsTablePagination totalPages={data?.totalPages ?? 0} />
        </Card.Footer>
      </StudentsCardLayout>
    </StudentsPageLayout>
  );
};
