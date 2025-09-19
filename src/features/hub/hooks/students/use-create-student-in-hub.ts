import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createStudentInHub } from "@/data-access/students/mutations";
import { CreateStudentInHubSchema } from "@/data-access/students/schemas";
import { getStudentsByHubIdQueryOptions } from "../../lib/hub-students-query-optionts";
import { getStudentsByUserIdQueryOptions } from "../../lib/user-students-query-options";

export const useCreateStudentInHub = () => {
  const queryClient = useQueryClient();
  const limitToaster = useLimitToaster();

  return useProtectedMutation({
    schema: CreateStudentInHubSchema,
    mutationFn: createStudentInHub,
    onSuccess: (data, variables) => {
      if (isDataAccessError(data)) {
        switch (data.type) {
          case "LIMIT_EXCEEDED_STUDENTS":
            limitToaster({
              title: data.message,
            });
            return;
          default:
            toast.error(data.message);
            return;
        }
      }

      const hubStudentsQueryKey = getStudentsByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;
      queryClient.invalidateQueries({
        queryKey: hubStudentsQueryKey,
      });

      const userStudentsQueryKey = getStudentsByUserIdQueryOptions().queryKey;
      queryClient.invalidateQueries({
        queryKey: userStudentsQueryKey,
      });
    },
  });
};
