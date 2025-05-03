import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteQuestionFormSchema } from "../lib/questions.schema";
import { deleteQuestionUseCase } from "../use-cases/questions.use-case";

export const useDeleteQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: DeleteQuestionFormSchema,
    mutationFn: (data) => deleteQuestionUseCase(data),

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
