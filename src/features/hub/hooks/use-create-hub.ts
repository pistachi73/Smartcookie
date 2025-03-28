import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { CreateHubUseCaseSchema } from "../lib/schemas";
import { useHubFormStore } from "../store/hub-form-store";
import { createHubUseCase } from "../use-cases/create-hub.use-case";

export function useCreateHub() {
  const reset = useHubFormStore((state) => state.reset);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useProtectedMutation({
    schema: CreateHubUseCaseSchema.omit({ userId: true }),
    mutationFn: (input, { userId }) => {
      return createHubUseCase({
        ...input,
        userId,
      });
    },
    onSuccess: () => {
      toast.success("Hub created successfully");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      reset();
      router.push("/portal/hubs");
    },
    onError: (error) => {
      toast.error("Failed to create hub");
      console.error(error);
    },
  });
}
