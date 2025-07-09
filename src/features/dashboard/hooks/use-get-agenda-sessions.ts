import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { getAgendaSessionsQueryOptions } from "./hook-options";

export const useGetAgendaSessions = (dateInterval: [Date, Date]) => {
  const user = useCurrentUser();
  return useQuery(getAgendaSessionsQueryOptions(dateInterval));
};
