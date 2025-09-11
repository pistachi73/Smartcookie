import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { createHub } from "@/data-access/hubs/mutations";
import { CreateHubUseCaseSchema } from "@/data-access/hubs/schemas";
import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";

export function useCreateHub() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useProtectedMutation({
    schema: CreateHubUseCaseSchema,
    mutationFn: createHub,
    onMutate: async () => {
      const hubsQueryKey = getHubsByUserIdQueryOptions.queryKey;
      await queryClient.cancelQueries({ queryKey: hubsQueryKey });
    },

    onSuccess: () => {
      toast.success("Hub created successfully");
      router.push("/portal/hubs");
    },
    onError: (error) => {
      toast.error("Failed to create hub");
      console.error(error);
    },
  });
}
