import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { removeStudentFromHub } from "@/data-access/students/mutations";
import { RemoveStudentFromHubSchema } from "@/data-access/students/schemas";

export const useRemoveStudentFromHub = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: RemoveStudentFromHubSchema,
    mutationFn: (data) => removeStudentFromHub(data),
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
    onError: () => {
      toast.error("Failed to remove student from hub. Please try again later.");
    },
  });
};
