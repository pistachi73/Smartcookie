import { Heading } from "@/shared/components/ui/heading";

import type { TABS } from "../../lib/constants";
import { CourseOverview } from "./course-overview";
import { SessionTimeline } from "./session-timeline";

export const HubOverview = ({
  hubId,
  setSelectedTab,
}: {
  hubId: number;
  setSelectedTab: (tab: (typeof TABS)[number]["id"]) => void;
}) => {
  return (
    <div className="@container space-y-6">
      <div className="flex flex-row items-center justify-between mb-4 flex-wrap gap-3">
        <Heading level={2}>Overview</Heading>
      </div>

      <CourseOverview hubId={hubId} />

      <SessionTimeline
        hubId={hubId}
        onGoToSessions={() => setSelectedTab("sessions")}
      />
    </div>
  );
};
