import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { getHubSessions } from "../use-cases/get-hub-sessions.use-case";

export const useHubSessions = ({ hubId }: { hubId: number }) => {
  const user = useCurrentUser();

  return useQuery({
    queryKey: ["hub-sessions", hubId],
    queryFn: () => getHubSessions({ hubId, userId: user.id }),
  });
};
