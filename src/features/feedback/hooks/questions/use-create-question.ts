import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuestionFormSchema } from "../../lib/questions.schema";
import { createQuestionUseCase } from "../../use-cases/questions.use-case";

export const useCreateQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: QuestionFormSchema,
    mutationFn: (data) => createQuestionUseCase(data),

    onSuccess: () => {
      toast.success("Question created successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "questions"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create question");
    },
  });
};
