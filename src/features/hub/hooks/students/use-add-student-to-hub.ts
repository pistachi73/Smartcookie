import { addStudentToHub } from "@/data-access/students/mutations";
import { AddStudentToHubSchema } from "@/data-access/students/schemas";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";

export const useAddStudentToHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: AddStudentToHubSchema,
    mutationFn: (data) => addStudentToHub(data),
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
