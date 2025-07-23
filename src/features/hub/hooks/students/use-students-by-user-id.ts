import { useQuery } from "@tanstack/react-query";

import { getStudentsByUserIdQueryOptions } from "../../lib/user-students-query-options";

export const useStudentsByUserId = () => {
  return useQuery(getStudentsByUserIdQueryOptions());
};
