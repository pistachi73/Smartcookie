"use client";

import { Card } from "@/shared/components/ui/card";

import { StudentsCardLayout } from "./students-card-layout";
import { StudentsPageLayout } from "./students-page-layout";
import { StudentsTableSkeleton } from "./students-table/students-table-skeleton";

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
