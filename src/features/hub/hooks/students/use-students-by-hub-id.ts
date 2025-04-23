import { useQuery } from "@tanstack/react-query";
import { getStudentsByHubIdUseCase } from "../../use-cases/students.use-case";

export const useStudentsByHubId = (hubId: number) => {
  return useQuery({
    queryKey: ["hub-students", hubId],
    queryFn: async () => {
      console.log({ hubId });
      const res = await getStudentsByHubIdUseCase({ hubId });
      console.log(res);
      return res;
    },
  });
};
