import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddSessionsUseCaseSchema } from "../../lib/schemas";
import { addSessionUseCase } from "../../use-cases/session.use-case";
export const useAddSessions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: AddSessionsUseCaseSchema.omit({ userId: true }),
    mutationFn: (data, { userId }) => addSessionUseCase({ ...data, userId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", variables.hubId],
      });
      toast.success("Session added successfully");
      onSuccess?.();
    },
  });
};
