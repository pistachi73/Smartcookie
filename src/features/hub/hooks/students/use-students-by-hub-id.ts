import { useQuery } from "@tanstack/react-query";
import { getStudentsByHubIdQueryOptions } from "../../lib/hub-students-query-optionts";

export const useStudentsByHubId = (hubId: number) => {
  return useQuery(getStudentsByHubIdQueryOptions(hubId));
};
