import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { addStudentsToHub } from "@/data-access/students/mutations";
import { AddStudentsToHubSchema } from "@/data-access/students/schemas";
import { getStudentsByHubIdQueryOptions } from "../../lib/hub-students-query-optionts";
import { getStudentsByUserIdQueryOptions } from "../../lib/user-students-query-options";

export const useAddStudentsToHub = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: AddStudentsToHubSchema,
    mutationFn: addStudentsToHub,
    onSuccess: (data, variables) => {
      if (isDataAccessError(data)) {
        toast.error(data.message);
        return;
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

      onSuccess?.();
    },
  });
};
