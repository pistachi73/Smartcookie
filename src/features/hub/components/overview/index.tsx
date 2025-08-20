import { Heading } from "@/shared/components/ui/heading";

import { CourseOverview } from "./course-overview";

export const HubOverview = ({ hubId }: { hubId: number }) => {
  return (
    <div className="@container space-y-6">
      <div className="flex flex-row items-center justify-between mb-4 flex-wrap gap-3">
        <Heading level={2}>Overview</Heading>
      </div>

      <CourseOverview hubId={hubId} />
    </div>
  );
};
