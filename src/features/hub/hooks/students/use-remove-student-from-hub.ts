import { removeStudentFromHub } from "@/data-access/students/mutations";
import { RemoveStudentFromHubSchema } from "@/data-access/students/schemas";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveStudentFromHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: RemoveStudentFromHubSchema,
    mutationFn: (data) => removeStudentFromHub(data),
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
    onError: () => {
      toast.error("Failed to remove student from hub. Please try again later.");
    },
  });
};
