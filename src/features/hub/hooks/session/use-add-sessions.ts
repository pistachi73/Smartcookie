import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addSessionUseCase } from "../../use-cases/session.use-case";

export const useAddSessions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSessionUseCase,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      toast.success("Session added successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
