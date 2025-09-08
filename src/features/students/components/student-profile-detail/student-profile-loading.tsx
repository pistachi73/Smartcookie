import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { StudentProfileLayout } from "./student-profile-layout";

export const StudentProfileLoading = () => (
  <StudentProfileLayout>
    <div className="grid grid-cols-1 @6xl:grid-cols-3 gap-6">
      <div className="@6xl:col-span-2 space-y-6">
        <Card className="relative @container">
          <Card.Header className="flex items-center gap-4 justify-between h-">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full absolute top-4 right-4" />
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header
          title="Enrolled Courses"
          description="The courses the student is enrolled in."
        />
        <Card.Content className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton className="h-24 w-full" key={`hub-skeleton-${index}`} />
          ))}
        </Card.Content>
      </Card>
    </div>
  </StudentProfileLayout>
);


