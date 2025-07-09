import { createStudentInHub } from "@/data-access/students/mutations";
import { CreateStudentInHubSchema } from "@/data-access/students/schemas";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateStudentInHub = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useProtectedMutation({
    schema: CreateStudentInHubSchema,
    mutationFn: (data) => createStudentInHub(data),
    onSuccess: (data, variables) => {
      if (!data.success) return;
      queryClient.invalidateQueries({
        queryKey: ["user-students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });
};
