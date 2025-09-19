import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createHub } from "@/data-access/hubs/mutations";
import { CreateHubUseCaseSchema } from "@/data-access/hubs/schemas";
import { useRouter } from "@/i18n/navigation";
import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";

export function useCreateHub() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const limitToaster = useLimitToaster();

  return useProtectedMutation({
    schema: CreateHubUseCaseSchema,
    mutationFn: createHub,
    onSuccess: (data) => {
      if (isDataAccessError(data)) {
        switch (data.type) {
          case "LIMIT_REACHED_HUBS":
            limitToaster({
              title: data.message,
            });
            return;
          default:
            toast.error(data.message);
            return;
        }
      }

      queryClient.invalidateQueries({
        queryKey: getHubsByUserIdQueryOptions.queryKey,
      });

      toast.success("Hub created successfully");
      router.push("/portal/hubs");
    },
  });
}
