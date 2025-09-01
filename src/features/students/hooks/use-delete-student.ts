import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteStudent } from "@/data-access/students/mutations";
import { DeleteStudentSchema } from "@/data-access/students/schemas";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteStudentSchema,
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["calendar-sessions"],
      });
    },
    onError: () => {
      toast.error("Failed to delete student. Please try again later.");
    },
  });
};
