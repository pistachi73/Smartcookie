import { useQuery } from "@tanstack/react-query";
import { getSessionsByHubIdUseCase } from "../../use-cases/sessions.use-case";

export const useSessionsByHubId = (hubId: number) => {
  return useQuery({
    queryKey: ["hub-sessions", hubId],
    queryFn: () => getSessionsByHubIdUseCase({ hubId }),
  });
};
