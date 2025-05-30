import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateQuestionFormSchema } from "../lib/questions.schema";
import { updateQuestionUseCase } from "../use-cases/questions.use-case";

export const useUpdateQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: UpdateQuestionFormSchema,
    mutationFn: (data) => updateQuestionUseCase(data),

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
