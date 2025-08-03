import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
  InformationCircleIcon,
  StatusIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/classes";

import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { useHubById } from "../../hooks/use-hub-by-id";

interface CourseOverviewProps {
  hubId: number;
}

export const CourseOverview = ({ hubId }: CourseOverviewProps) => {
  const { data: hub, isLoading: hubLoading } = useHubById(hubId);
  const { data: students, isLoading: studentsLoading } =
    useStudentsByHubId(hubId);

  if (hubLoading) {
    return <CourseOverviewSkeleton />;
  }

  if (!hub) {
    return (
      <Card className="border-dashed" spacing="md">
        <Card.Content className="text-center py-12">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="h-12 w-12 mx-auto text-muted-fg mb-4"
          />
          <Heading level={3} className="mb-2">
            Course not found
          </Heading>
          <p className="text-sm text-muted-fg">
            Unable to load course information at this time.
          </p>
        </Card.Content>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getDuration = () => {
    if (!hub.startDate || !hub.endDate) return null;

    try {
      const start = new Date(hub.startDate);
      const end = new Date(hub.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
    } catch {
      return null;
    }
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "active":
        return { intent: "success" as const, text: "Active" };
      case "inactive":
        return { intent: "secondary" as const, text: "Inactive" };
      default:
        return { intent: "secondary" as const, text: status };
    }
  };

  const statusProps = getStatusBadgeProps(hub.status);
  const duration = getDuration();
  const totalStudents = studentsLoading ? null : students?.length || 0;

  return (
    <div className="space-y-6">
      {/* Main Course Information */}
      <Card>
        <Card.Header>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <Heading level={3} className="text-xl">
                  Course Details
                </Heading>
                <Badge intent={statusProps.intent}>{statusProps.text}</Badge>
              </div>
              {hub.description && (
                <p className="text-muted-fg leading-relaxed">
                  {hub.description}
                </p>
              )}
            </div>
          </div>
        </Card.Header>

        <Separator />

        <Card.Content className="grid gap-6">
          {/* Schedule & Duration Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={16}
                  className="text-muted-fg"
                />
                Schedule Information
              </div>
              <div className="space-y-2 pl-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-fg">Start Date:</span>
                  <span className="font-medium">
                    {formatDate(hub.startDate)}
                  </span>
                </div>
                {hub.endDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-fg">End Date:</span>
                    <span className="font-medium">
                      {formatDate(hub.endDate)}
                    </span>
                  </div>
                )}
                {duration && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-fg">Duration:</span>
                    <span className="font-medium">{duration}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HugeiconsIcon
                  icon={UserMultiple02Icon}
                  size={16}
                  className="text-muted-fg"
                />
                Enrollment
              </div>
              <div className="space-y-2 pl-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-fg">Total Students:</span>
                  <span className="font-medium">
                    {studentsLoading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      totalStudents
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Card.Content className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <HugeiconsIcon
                icon={StatusIcon}
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Status</p>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                {statusProps.text}
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <Card.Content className="flex items-center gap-3 p-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HugeiconsIcon
                icon={UserMultiple02Icon}
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Students</p>
              <p className="font-semibold text-green-900 dark:text-green-100">
                {studentsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  `${totalStudents} enrolled`
                )}
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
          <Card.Content className="flex items-center gap-3 p-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Duration</p>
              <p className="font-semibold text-purple-900 dark:text-purple-100">
                {duration || "Open-ended"}
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Course Timeline */}
      {hub.startDate && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={20}
                className="text-muted-fg"
              />
              <Heading level={4}>Course Timeline</Heading>
            </div>
          </Card.Header>
          <Separator />
          <Card.Content>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="relative z-10 w-8 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">Course Started</p>
                      <Badge intent="success" className="text-xs">
                        Started
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-fg">
                      {formatDate(hub.startDate)}
                    </p>
                  </div>
                </div>

                {hub.endDate && (
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "relative z-10 w-8 h-8 border-2 rounded-full flex items-center justify-center",
                        new Date() > new Date(hub.endDate)
                          ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          new Date() > new Date(hub.endDate)
                            ? "bg-blue-500"
                            : "bg-gray-400",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">Course Ends</p>
                        <Badge
                          intent={
                            new Date() > new Date(hub.endDate)
                              ? "secondary"
                              : "warning"
                          }
                          className="text-xs"
                        >
                          {new Date() > new Date(hub.endDate)
                            ? "Completed"
                            : "Upcoming"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-fg">
                        {formatDate(hub.endDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

const CourseOverviewSkeleton = () => (
  <div className="space-y-6">
    {/* Main Card Skeleton */}
    <Card>
      <Card.Header>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
      </Card.Header>
      <Separator />
      <Card.Content className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2 pl-6">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-18" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2 pl-6">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <Card.Content className="flex items-center gap-3 p-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>

    {/* Timeline Skeleton */}
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
      </Card.Header>
      <Separator />
      <Card.Content>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  </div>
);
