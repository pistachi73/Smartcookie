import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { updateStudent } from "@/data-access/students/mutations";
import { UpdateStudentSchema } from "@/data-access/students/schemas";
import { getUserStudentByIdQueryOptions } from "../lib/user-students-query-options";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: UpdateStudentSchema,
    mutationFn: updateStudent,
    onMutate: async (data) => {
      const studentQueryKey = getUserStudentByIdQueryOptions(data.id).queryKey;

      const previousStudentData = queryClient.getQueryData(studentQueryKey);

      queryClient.setQueryData(studentQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          ...data,
        };
      });

      return { previousStudentData, studentQueryKey };
    },
    onSuccess: (data, _, context) => {
      if (isDataAccessError(data)) {
        toast.error(data.message);
        queryClient.setQueryData(
          context.studentQueryKey,
          context.previousStudentData,
        );
        return;
      }
      toast.success("Student updated successfully");
    },
    onError: (_, __, context) => {
      if (context?.previousStudentData) {
        queryClient.setQueryData(
          context.studentQueryKey,
          context.previousStudentData,
        );
      }
      toast.error("Failed to update student");
    },
  });
};
