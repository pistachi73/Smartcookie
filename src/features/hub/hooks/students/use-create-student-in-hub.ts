import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { CreateStudentInHubUseCaseSchema } from "../../lib/students.schema";
import { createStudentInHubUseCase } from "../../use-cases/students.use-case";

export const useCreateStudentInHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: CreateStudentInHubUseCaseSchema,
    mutationFn: (data) => createStudentInHubUseCase(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-students", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
    },
  });
};
