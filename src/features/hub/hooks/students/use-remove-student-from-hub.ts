import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { RemoveStudentFromHubUseCaseSchema } from "../../lib/students.schema";
import { removeStudentFromHubUseCase } from "../../use-cases/students.use-case";

export const useRemoveStudentFromHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: RemoveStudentFromHubUseCaseSchema,
    mutationFn: (data) => removeStudentFromHubUseCase(data),
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
