import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { createHub } from "@/data-access/hubs/mutations";
import { CreateHubUseCaseSchema } from "@/data-access/hubs/schemas";
import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";
import { useHubFormStore } from "../store/hub-form-store";

export function useCreateHub() {
  const reset = useHubFormStore((state) => state.reset);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useProtectedMutation({
    schema: CreateHubUseCaseSchema,
    mutationFn: createHub,
    onMutate: async () => {
      const hubsQueryKey = getHubsByUserIdQueryOptions(queryClient).queryKey;
      await queryClient.cancelQueries({ queryKey: hubsQueryKey });
    },

    onSuccess: () => {
      toast.success("Hub created successfully");
      reset();
      router.push("/portal/hubs");
    },
    onError: (error) => {
      toast.error("Failed to create hub");
      console.error(error);
    },
  });
}
