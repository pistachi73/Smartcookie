import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteSurveySchema } from "../../lib/surveys.schema";
import { deleteSurveyTemplateUseCase } from "../../use-cases/survey-templates.use-case";

export const useDeleteSurveyTemplate = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: DeleteSurveySchema,
    mutationFn: (data) => deleteSurveyTemplateUseCase(data),

    onSuccess: () => {
      toast.success("Survey deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete survey");
    },
  });
};
