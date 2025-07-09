import { addStudentToHub } from "@/data-access/students/mutations";
import { AddStudentToHubSchema } from "@/data-access/students/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";

export const useAddStudentToHub = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: AddStudentToHubSchema,
    mutationFn: (data) => addStudentToHub(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-students"],
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
