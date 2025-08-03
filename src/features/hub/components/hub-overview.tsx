import { useHubById } from "../hooks/use-hub-by-id";
import { CourseOverview } from "./overview/course-overview";

type HubOverviewProps = {
  hubId: number;
};

export const HubOverview = ({ hubId }: HubOverviewProps) => {
  const { data: hub } = useHubById(hubId);

  if (!hub) {
    return null;
  }

  return <CourseOverview hubId={hubId} />;
};
