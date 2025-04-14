import { useHubById } from "../hooks/use-hub-by-id";

type HubOverviewProps = {
  hubId: number;
};

export const HubOverview = ({ hubId }: HubOverviewProps) => {
  const { data: hub } = useHubById(hubId);

  if (!hub) {
    return null;
  }

  return <div>HubOverview</div>;
};
