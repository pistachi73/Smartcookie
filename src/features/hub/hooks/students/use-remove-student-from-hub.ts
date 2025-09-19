import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { removeStudentFromHub } from "@/data-access/students/mutations";
import { RemoveStudentFromHubSchema } from "@/data-access/students/schemas";
import { getStudentsByHubIdQueryOptions } from "../../lib/hub-students-query-optionts";

export const useRemoveStudentFromHub = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: RemoveStudentFromHubSchema,
    mutationFn: removeStudentFromHub,
    onSuccess: (res, variables) => {
      if (isDataAccessError(res)) {
        toast.error(res.message);
        return;
      }

      const hubStudentsQueryKey = getStudentsByHubIdQueryOptions(
        variables.hubId,
      ).queryKey;
      queryClient.invalidateQueries({
        queryKey: hubStudentsQueryKey,
      });
    },
  });
};
