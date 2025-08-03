import { useQuery } from "@tanstack/react-query";

import { getAgendaSessionsQueryOptions } from "./hook-options";

export const useGetAgendaSessions = (dateInterval: [Date, Date]) => {
  return useQuery(getAgendaSessionsQueryOptions(dateInterval));
};
