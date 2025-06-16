"use client";

import { updateSession } from "@/data-access/sessions/mutations";
import { UpdateSessionSchema } from "@/data-access/sessions/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: UpdateSessionSchema,
    mutationFn: updateSession,
    onSuccess: (_, variables) => {
      toast.success("Session updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
    },
    onError: () => {
      toast.error("Failed to update session");
    },
  });
};
