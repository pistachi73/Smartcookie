import { queryOptions } from "@tanstack/react-query";

import { getNextSession } from "@/data-access/sessions/queries";

export const getNextSessionQueryOptions = () => {
  return queryOptions({
    queryKey: ["next-session"],
    queryFn: () => getNextSession(),
  });
};
