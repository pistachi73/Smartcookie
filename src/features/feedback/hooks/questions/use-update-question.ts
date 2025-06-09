import { updateQuestion } from "@/data-access/questions/mutations";
import { UpdateQuestionSchema } from "@/data-access/questions/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: UpdateQuestionSchema,
    mutationFn: (data) => updateQuestion(data),

    onSuccess: (_, data) => {
      toast.success("Question updated successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", data.id] });

      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });
};
