import { addSessions } from "@/data-access/sessions/mutations";
import { AddSessionsSchema } from "@/data-access/sessions/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddSessions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: AddSessionsSchema,
    mutationFn: addSessions,
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
