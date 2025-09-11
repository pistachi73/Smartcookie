import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table } from "@/shared/components/ui/table";

import { columns } from "./columns";

type SkeletonItem = {
  id: number;
};
export const StudentsTableSkeleton = () => {
  const items: SkeletonItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
  }));

  return (
    <Table
      aria-label="Loading students"
      bleed
      className="[--gutter:var(--card-spacing)] sm:[--gutter:var(--card-spacing)] border-b [--gutter-y:--spacing(3)]"
    >
      <Table.Header columns={columns}>
        {columns.map((column) => (
          <Table.Column key={column.id} isRowHeader={column.isRowHeader}>
            {column.name}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body items={items}>
        {() => (
          <Table.Row>
            <Table.Cell className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-0.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-28" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-24" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-20" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-20" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-5 w-16 rounded-full" />
            </Table.Cell>
            <Table.Cell className="max-w-[56px]">
              <div className="flex justify-end">
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
