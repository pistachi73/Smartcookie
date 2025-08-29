"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table } from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

const columns = [
  { id: "name", name: "Name" },
  { id: "email", name: "Email" },
  { id: "actions", name: "Actions" },
];

type SkeletonItem = {
  id: number;
};

export const SkeletonStudentListView = () => {
  const items: SkeletonItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
  }));

  return (
    <Table
      aria-label="Loading students"
      bleed
      className={cn(
        " border-t",
        "[--gutter:--spacing(4)] sm:[--gutter:--spacing(6)]",
        "[--gutter-y:--spacing(3)]",
      )}
    >
      <Table.Header columns={columns} className={"bg-muted"}>
        <Table.Column isRowHeader>Student Name</Table.Column>
        <Table.Column className="h-full">
          Attended Sessions (completed sessions)
        </Table.Column>
        <Table.Column />
      </Table.Header>
      <Table.Body items={items}>
        {() => (
          <Table.Row>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-48" />
            </Table.Cell>
            <Table.Cell className="max-w-[56px]">
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8" />
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
