import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHubAction } from "../actions";

interface CreateHubOptions {
  onSuccess?: () => void;
}

export function useCreateHub({ onSuccess }: CreateHubOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHubAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
