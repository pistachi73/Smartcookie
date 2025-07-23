import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteQuestion } from "@/data-access/questions/mutations";
import { DeleteQuestionSchema } from "@/data-access/questions/schemas";

export const useDeleteQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: DeleteQuestionSchema,
    mutationFn: (data) => deleteQuestion(data),

    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "questions"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });
};
