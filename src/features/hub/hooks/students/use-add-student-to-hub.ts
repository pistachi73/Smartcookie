import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { AddStudentToHuUseCaseSchema } from "../../lib/students.schema";
import { addStudentToHubUseCase } from "../../use-cases/students.use-case";

export const useAddStudentToHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: AddStudentToHuUseCaseSchema,
    mutationFn: (data) => addStudentToHubUseCase(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-students", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendar-sessions"],
      });
    },
  });
};
