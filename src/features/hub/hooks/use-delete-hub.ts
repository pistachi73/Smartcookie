import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { deleteHub } from "@/data-access/hubs/mutations";
import { DeleteHubSchema } from "@/data-access/hubs/schemas";
import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";

export const useDeleteHub = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteHubSchema,
    mutationFn: deleteHub,
    onSuccess: (data) => {
      if (isDataAccessError(data)) {
        toast.error(data.message);
        return;
      }
      toast.success("Hub deleted successfully");

      const hubsQueryKey = getHubsByUserIdQueryOptions.queryKey;

      queryClient.invalidateQueries({
        queryKey: hubsQueryKey,
      });

      onSuccess?.();
    },
  });
};
