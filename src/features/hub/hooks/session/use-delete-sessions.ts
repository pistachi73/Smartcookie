import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteSession } from "@/data-access/sessions/mutations";
import { DeleteSessionsSchema } from "@/data-access/sessions/schemas";

export const useDeleteSession = ({ hubId }: { hubId: number }) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteSessionsSchema,
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hub-sessions", hubId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hub-students", hubId],
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
