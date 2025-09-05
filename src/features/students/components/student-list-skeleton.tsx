import { Card } from "@/shared/components/ui/card";

import { StudentsCardLayout, StudentsPageLayout } from ".";
import { StudentsTableSkeleton } from "./students-table";

export const StudentListSkeleton = () => {
  return (
    <StudentsPageLayout>
      <StudentsCardLayout>
        <Card.Content>
          <StudentsTableSkeleton />
        </Card.Content>
      </StudentsCardLayout>
    </StudentsPageLayout>
  );
};
