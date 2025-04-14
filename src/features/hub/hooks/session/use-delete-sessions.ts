import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteSessionsUseCaseSchema } from "../../lib/sessions.schema";
import { deleteSessionUseCase } from "../../use-cases/sessions.use-case";

export const useDeleteSession = ({ hubId }: { hubId: number }) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteSessionsUseCaseSchema,
    mutationFn: (data) => deleteSessionUseCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", hubId],
      });
      toast.success("Sessions deleted successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete sessions");
      }
    },
  });
};
