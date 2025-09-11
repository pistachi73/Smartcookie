import { Card, CardDescription, CardTitle } from "@/shared/components/ui/card";

import { StudentsTableSearch } from "./students-table/students-table-search";

export const StudentsCardLayout = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <Card>
      <div className="px-(--card-spacing) flex flex-col gap-4 md:gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1 w-full">
          <CardTitle>Explore students</CardTitle>
          <CardDescription>
            Manage your students and their progress. Add, edit, and delete
            students as needed.
          </CardDescription>
        </div>
        <div className="flex-1 w-full md:w-fit flex items-end h-full">
          <StudentsTableSearch />
        </div>
      </div>
      {children}
    </Card>
  );
};
