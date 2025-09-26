import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { updateHub } from "@/data-access/hubs/mutations";
import { UpdateHubSchema } from "@/data-access/hubs/schemas";
import {
  getHubByIdQueryOptions,
  getHubsByUserIdQueryOptions,
} from "../lib/hub-query-options";

export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: UpdateHubSchema,
    mutationFn: updateHub,
    onSuccess: (data, variables) => {
      if (isDataAccessError(data)) {
        toast.error(data.message);
      }

      const hubsQueryKey = getHubsByUserIdQueryOptions.queryKey;
      const hubQueryKey = getHubByIdQueryOptions(variables.hubId).queryKey;

      queryClient.invalidateQueries({
        queryKey: hubsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: hubQueryKey,
      });

      toast.success("Course updated successfully");
    },
  });
}
