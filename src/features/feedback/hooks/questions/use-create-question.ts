import { createQuestion } from "@/data-access/questions/mutations";
import { CreateQuestionSchema } from "@/data-access/questions/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateQuestion = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: CreateQuestionSchema,
    mutationFn: (data) => createQuestion(data),

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
