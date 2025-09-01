import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Heading } from "@/shared/components/ui/heading";

import { getHubByIdQueryOptions } from "../../lib/hub-query-options";

export const HubOverview = ({ hubId }: { hubId: number }) => {
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  return (
    <div className="@container space-y-6 grid-cols-3 gap-x-8">
      <div className="space-y-2">
        <Heading level={3}>Description</Heading>
        <p className="text-base">{hub?.description}</p>
      </div>

      {/* <SessionsWidget hubIds={[hubId]} /> */}

      <div className="space-y-2">
        <Heading level={3}>Course Dates</Heading>
        <div className="flex items-center gap-4 rounded-sm w-full">
          <div className="space-y-1   rounded-sm">
            <div className="text-base font-medium">
              {hub?.startDate && format(hub.startDate, "EEEE, d MMMM yyyy")}
            </div>
          </div>
          <div className="flex flex-col gap-2 aspect-square bg-muted size-10 items-center justify-center  rounded-sm">
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
          </div>
          <div className="space-y-1 rounded-sm">
            <div className="text-base font-medium">
              {hub?.endDate && format(hub.endDate, "EEEE, d MMMM yyyy")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Heading level={3}>Course progress</Heading>
        <div className="flex items-center gap-1 w-1/2 ">
          {Array.from({ length: 30 }).map((_, index) => (
            <div key={index} className="h-20 w-full bg-muted rounded-sm" />
          ))}
        </div>
        <p className="text-sm text-muted-fg font-medium">10% Completed</p>
      </div>
    </div>
  );
};
