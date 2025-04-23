import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddSessionsUseCaseSchema } from "../../lib/sessions.schema";
import { addSessionsUseCase } from "../../use-cases/sessions.use-case";

export const useAddSessions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: AddSessionsUseCaseSchema,
    mutationFn: (data) => {
      console.log({ data });
      return addSessionsUseCase(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", variables.hubId],
      });
      toast.success("Session added successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
