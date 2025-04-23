import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { getStudentsByUserIdUseCase } from "../../use-cases/students.use-case";

export const useStudentsByUserId = () => {
  const user = useCurrentUser();
  return useQuery({
    queryKey: ["user-students", user?.id],
    queryFn: () => getStudentsByUserIdUseCase(),
  });
};
