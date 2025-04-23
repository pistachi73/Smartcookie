"use client";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateSessionUseCaseSchema } from "../../lib/sessions.schema";
import { updateSessionUseCase } from "../../use-cases/sessions.use-case";

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: UpdateSessionUseCaseSchema,
    mutationFn: (data) => updateSessionUseCase(data),
    onSuccess: (_, variables) => {
      toast.success("Session updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update session",
      );
    },
  });
};
