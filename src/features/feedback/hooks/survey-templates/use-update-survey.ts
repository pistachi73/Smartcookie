import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateSurveyTemplateSchema } from "../../lib/surveys.schema";
import { updateSurveyTemplateUseCase } from "../../use-cases/survey-templates.use-case";

export const useUpdateSurvey = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: UpdateSurveyTemplateSchema,
    mutationFn: async (data) => updateSurveyTemplateUseCase(data),
    onSuccess: (_, variables) => {
      toast.success("Survey updated successfully");
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({
        queryKey: ["survey-template", variables.id],
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update survey");
    },
  });
};
