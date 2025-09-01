"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/layout/page-header";

import { getPaginatedUserStudentsQueryOptions } from "../lib/user-students-query-options";
import { validateStudentsSearchParams } from "../lib/validate-students-search-params";
import { StudentsTable, StudentsTableSkeleton } from "./students-table";
import { StudentsTablePagination } from "./students-table/students-table-pagination";
import { StudentsTableSearch } from "./students-table/students-table-search";

export const Students = () => {
  const searchParams = useSearchParams();
  const { page, q } = validateStudentsSearchParams(searchParams);

  const { data, isLoading, isPlaceholderData } = useQuery(
    getPaginatedUserStudentsQueryOptions({
      page,
      pageSize: 5,
      q,
    }),
  );

  const isLoadingStudents = isLoading || isPlaceholderData;

  return (
    <div className="space-y-6 p-4 sm:p-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Explore students</CardTitle>
          <CardDescription>
            Manage your students and their progress. Add, edit, and delete
            students as needed.
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <StudentsTableSearch />
          </CardAction>
        </CardHeader>
        <Card.Content>
          {isLoadingStudents ? (
            <StudentsTableSkeleton />
          ) : (
            <StudentsTable students={data?.students ?? []} />
          )}
        </Card.Content>
        <Card.Footer className="flex justify-between w-full">
          <p className="text-sm text-muted-fg">
            Showing Page <span className="font-medium text-fg">{page}</span> of{" "}
            <span className="font-medium text-fg">{data?.totalPages}</span> of{" "}
            <span className="font-medium text-fg">{data?.totalCount}</span>{" "}
            results
          </p>
          <StudentsTablePagination totalPages={data?.totalPages ?? 0} />
        </Card.Footer>
      </Card>
    </div>
  );
};
